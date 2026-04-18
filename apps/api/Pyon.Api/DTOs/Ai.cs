namespace __PYON_NAMESPACE__.Api.DTOs;

public record AiChatMessage(string Role, string Content);
public record AiChatRequest(IReadOnlyList<AiChatMessage> Messages, string? System, float? Temperature);
public record AiChatResponse(string Role, string Content, AiUsage? Usage);
public record AiUsage(int PromptTokens, int CompletionTokens, int TotalTokens);
