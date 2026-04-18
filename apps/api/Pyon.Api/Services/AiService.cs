using System.ClientModel;
using Azure;
using Azure.AI.OpenAI;
using OpenAI.Chat;
using __PYON_NAMESPACE__.Api.DTOs;

namespace __PYON_NAMESPACE__.Api.Services;

public interface IAiService
{
    bool IsConfigured { get; }
    Task<AiChatResponse> ChatAsync(AiChatRequest request, CancellationToken ct);
}

public sealed class AiOptions
{
    public string? Endpoint { get; set; }     // https://<resource>.openai.azure.com  (Azure)
    public string? ApiKey { get; set; }
    public string? Deployment { get; set; }   // Azure OpenAI deployment name OR OpenAI model id
    public string DefaultSystem { get; set; } = "You are a concise, helpful assistant.";
    public bool UseAzure { get; set; } = true;
}

public class AiService(IConfiguration config, ILogger<AiService> logger) : IAiService
{
    private readonly AiOptions _opt = LoadOptions(config);

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_opt.ApiKey) && !string.IsNullOrWhiteSpace(_opt.Deployment) &&
        (!_opt.UseAzure || !string.IsNullOrWhiteSpace(_opt.Endpoint));

    public async Task<AiChatResponse> ChatAsync(AiChatRequest request, CancellationToken ct)
    {
        if (!IsConfigured)
            throw new InvalidOperationException("AI is not configured. Set AzureOpenAi or OpenAi env vars.");

        var chatClient = BuildChatClient();

        var messages = new List<ChatMessage>();
        var system = string.IsNullOrWhiteSpace(request.System) ? _opt.DefaultSystem : request.System!;
        messages.Add(new SystemChatMessage(system));
        foreach (var m in request.Messages)
        {
            messages.Add(m.Role?.ToLowerInvariant() switch
            {
                "assistant" => new AssistantChatMessage(m.Content),
                "system"    => new SystemChatMessage(m.Content),
                _           => new UserChatMessage(m.Content),
            });
        }

        var options = new ChatCompletionOptions();
        if (request.Temperature is float t) options.Temperature = t;

        var result = await chatClient.CompleteChatAsync(messages, options, ct);
        var completion = result.Value;

        var text = completion.Content.Count > 0 ? completion.Content[0].Text ?? "" : "";
        AiUsage? usage = completion.Usage is null
            ? null
            : new AiUsage(
                (int)completion.Usage.InputTokenCount,
                (int)completion.Usage.OutputTokenCount,
                (int)completion.Usage.TotalTokenCount);

        logger.LogInformation("AI chat OK ({Prompt}+{Completion}={Total} tokens)",
            usage?.PromptTokens, usage?.CompletionTokens, usage?.TotalTokens);

        return new AiChatResponse("assistant", text, usage);
    }

    private ChatClient BuildChatClient()
    {
        if (_opt.UseAzure)
        {
            var client = new AzureOpenAIClient(new Uri(_opt.Endpoint!), new AzureKeyCredential(_opt.ApiKey!));
            return client.GetChatClient(_opt.Deployment!);
        }
        return new ChatClient(_opt.Deployment!, new ApiKeyCredential(_opt.ApiKey!));
    }

    private static AiOptions LoadOptions(IConfiguration c)
    {
        var o = new AiOptions();
        var azEndpoint = c["AzureOpenAi:Endpoint"];
        var azKey      = c["AzureOpenAi:ApiKey"];
        var azDep      = c["AzureOpenAi:Deployment"];
        if (!string.IsNullOrWhiteSpace(azEndpoint) && !string.IsNullOrWhiteSpace(azKey))
        {
            o.UseAzure   = true;
            o.Endpoint   = azEndpoint;
            o.ApiKey     = azKey;
            o.Deployment = azDep;
        }
        else
        {
            o.UseAzure   = false;
            o.ApiKey     = c["OpenAi:ApiKey"];
            o.Deployment = c["OpenAi:Model"] ?? "gpt-4o-mini";
        }
        var sys = c["Ai:System"];
        if (!string.IsNullOrWhiteSpace(sys)) o.DefaultSystem = sys;
        return o;
    }
}
