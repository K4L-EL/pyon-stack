namespace __PYON_NAMESPACE__.Api.DTOs;

public record PostResponse(
    Guid Id,
    string Slug,
    string Title,
    string Excerpt,
    string BodyMarkdown,
    DateTime? PublishedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record PostUpsertRequest(
    string Title,
    string Slug,
    string Excerpt,
    string BodyMarkdown,
    bool Publish);
