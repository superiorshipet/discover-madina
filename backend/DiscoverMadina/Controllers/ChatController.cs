using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;

namespace DiscoverMadina.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;
    private readonly ILogger<ChatController> _logger;

    private const string SYSTEM_PROMPT = @"أنت ""مرشد المدينة"" - مساعد ذكي متخصص في المدينة المنورة فقط.
معلوماتك تشمل: المساجد (النبوي، قباء، القبلتين)، المتاحف، الحدائق، المطاعم، الأسواق، الفنادق، وكل ما يخص المدينة المنورة.
أسلوبك: ودي، مفيد، موجز. تجيب بالعربية دايماً.
ممنوع: الكلام عن مناطق خارج المدينة المنورة، السياسة، أي محتوى غير لائق.
لا تقول إنك ChatGPT أو أي AI آخر. أنت ""مرشد المدينة"".";

    public ChatController(IConfiguration config, ILogger<ChatController> logger, IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        if (request.Messages == null || request.Messages.Count == 0)
            return BadRequest(new { error = "الرسالة فارغة" });

        var apiKey = _config["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey) || apiKey.StartsWith("sk-your"))
            return BadRequest(new { error = "OpenAI API key not configured" });

        try
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            // Build full messages array: system + full conversation history
            var allMessages = new List<object>
            {
                new { role = "system", content = SYSTEM_PROMPT }
            };

            // Add all conversation history (max last 20 messages to avoid token limit)
            var history = request.Messages.TakeLast(20).ToList();
            foreach (var msg in history)
                allMessages.Add(new { role = msg.Role, content = msg.Content });

            var openAiRequest = new
            {
                model = "gpt-4o-mini",
                messages = allMessages,
                max_tokens = 500,
                temperature = 0.7
            };

            var json = JsonSerializer.Serialize(openAiRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("OpenAI error: {Status} - {Content}", response.StatusCode, errorContent);
                return StatusCode((int)response.StatusCode, new { error = "Chat service error" });
            }

            var result = await response.Content.ReadAsStringAsync();
            var chatResponse = JsonSerializer.Deserialize<OpenAIResponse>(result, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            var reply = chatResponse?.Choices?[0]?.Message?.Content ?? "لم أفهم السؤال، حاول مرة أخرى.";

            return Ok(new { reply });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Chat error");
            return StatusCode(500, new { error = "خطأ داخلي" });
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

public class OpenAIResponse
{
    public Choice[] Choices { get; set; } = Array.Empty<Choice>();
}

public class Choice
{
    public ChatMessage Message { get; set; } = new();
}
