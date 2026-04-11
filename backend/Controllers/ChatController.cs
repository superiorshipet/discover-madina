using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;
using DiscoverMadina.Repositories.Interfaces;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;
    private readonly ILogger<ChatController> _logger;
    private readonly IAttractionRepository _attractionRepo;
    private readonly IReviewRepository _reviewRepo;
    
    // Cache database content for 1 hour
    private static string? _cachedDatabaseContent = null;
    private static DateTime _cacheTime = DateTime.MinValue;
    private const int CACHE_MINUTES = 60;

    private const string SYSTEM_PROMPT_TEMPLATE = @"أنت مرشد المدينة - مساعد حقيقي ودود في تطبيق Discover Madina.
اسمك: مرشد. أنت شخص طبيعي, ودود, تحب تساعد الناس.

═══ تعليمات ═══

عند السؤال عن هويتك:
Q: ""من انت؟"" أو ""مين انت؟"" أو ""اسمك اي؟""
A: ""أنا مرشد, مساعدك في اكتشاف المدينة المنورة 😊. كيف ممكن أساعدك؟""

عند التحية:
Q: ""السلام عليكم"" أو ""مرحبا"" أو ""عامل اي""
A: ""وعليكم السلام! تمام الحمد لله 😊 إيش اللي تبحث عنه؟""

عند طلب اتجاهات/طريق:
Q: ""اوصفلي الطريق"" أو ""كيف أروح هناك"" أو ""الطريق كيف""
A: ""استخدم الخريطة بالتطبيق وهتشوف المكان بالضبط وأقصر طريق لك 🗺️""

عند وصف المعالم:
- لا تقل الإحداثيات إلا إذا موجودة في البيانات
- لا تعطي معلومات مخترعة
- قول فقط ما في البيانات

البيانات المتوفرة:
{DATABASE_CONTENT}

═══ قواعد مهمة ═══
✓ اجب مباشرة على السؤال بدة تكرار
✓ لا تكرر نفس الرد مرتين
✓ كن طبيعي جداً, زي الإنسان العادي
✓ عربي فقط, لا تخلط لغات
✓ إذا ما عندك معلومة, قول ""ما عندي معلومة عن هذا""
✓ مختصر في الردود";

    public ChatController(
        IConfiguration config, 
        ILogger<ChatController> logger, 
        IHttpClientFactory httpClientFactory,
        IAttractionRepository attractionRepo,
        IReviewRepository reviewRepo)
    {
        _config = config;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
        _attractionRepo = attractionRepo;
        _reviewRepo = reviewRepo;
    }

    private async Task<string> GetCachedDatabaseContent()
    {
        // Return cached content if still valid
        if (_cachedDatabaseContent != null && DateTime.UtcNow.Subtract(_cacheTime).TotalMinutes < CACHE_MINUTES)
            return _cachedDatabaseContent;

        try
        {
            var attractions = (await _attractionRepo.GetAllAsync()).ToList();
            if (!attractions.Any())
            {
                _cachedDatabaseContent = "لا توجد بيانات متاحة حالياً.";
                _cacheTime = DateTime.UtcNow;
                return _cachedDatabaseContent;
            }

            var sb = new StringBuilder();
            var groupedByCategory = attractions.GroupBy(a => a.Category).OrderBy(g => g.Key);

            foreach (var category in groupedByCategory)
            {
                sb.AppendLine($"\n📌 {category.Key}:");
                // Only show top 5 attractions per category to keep prompt size reasonable
                foreach (var attraction in category.Take(5))
                {
                    var ratingText = attraction.RatingAvg > 0 ? $" ⭐ {attraction.RatingAvg:F1}" : "";
                    sb.AppendLine($"  • {attraction.Name}{ratingText}");
                }
            }

            _cachedDatabaseContent = sb.ToString();
            _cacheTime = DateTime.UtcNow;
            return _cachedDatabaseContent;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error building database content");
            return "معلومات المعالم غير متاحة حالياً.";
        }
    }

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        if (request.Messages == null || request.Messages.Count == 0)
            return BadRequest(new { error = "الرسالة فارغة" });

        var apiKey = _config["Groq:ApiKey"];
return Ok(new { reply = "مرحبا! الدردشة تحت الصيانة. جرب: أماكن دينية؟ أو أقرب مطعم؟ 😊" });

        try
        {
            // Get cached database content
            var dbContent = await GetCachedDatabaseContent();
            var systemPrompt = SYSTEM_PROMPT_TEMPLATE.Replace("{DATABASE_CONTENT}", dbContent);

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            // Build full messages array: system + conversation history
            var allMessages = new List<object>
            {
                new { role = "system", content = systemPrompt }
            };

            // Add conversation history (max last 6 messages)
            var history = request.Messages.TakeLast(6).ToList();
            foreach (var msg in history)
                allMessages.Add(new { role = msg.Role, content = msg.Content });

            var groqRequest = new
            {
                model = "llama-3.3-70b-versatile",
                messages = allMessages,
                max_tokens = 350,
                temperature = 0.9,
                top_p = 0.95
            };

            var json = JsonSerializer.Serialize(groqRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.groq.com/openai/v1/chat/completions", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Groq error: {Status} - {Content}", response.StatusCode, errorContent);
                return StatusCode((int)response.StatusCode, new { error = "خدمة الدردشة غير متاحة حالياً" });
            }

            var result = await response.Content.ReadAsStringAsync();
            var chatResponse = JsonSerializer.Deserialize<GroqResponse>(result, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            var reply = chatResponse?.Choices?[0]?.Message?.Content ?? "لم أفهم السؤال، حاول مرة أخرى.";

            return Ok(new { reply });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Chat error");
            return StatusCode(500, new { error = "حدث خطأ في الدردشة" });
        }
    }
}

public class ChatRequest
{
    public List<ChatMessage> Messages { get; set; } = new();
}

public class ChatMessage
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class GroqResponse
{
    public GroqChoice[] Choices { get; set; } = Array.Empty<GroqChoice>();
}

public class GroqChoice
{
    public ChatMessage Message { get; set; } = new();
}
