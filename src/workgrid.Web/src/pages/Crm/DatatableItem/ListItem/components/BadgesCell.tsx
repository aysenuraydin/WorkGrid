export const BadgesCell = ({
    val,
    colClass,
}: {
    val: string;
    colClass?: string;
    [key: string]: any;
}) => {
    const tags: string[] = (val ?? "")
        .toString()
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

    if (tags.length === 0) return null;

    return (
        <div className={`d-flex gap-1 flex-wrap ${colClass ?? ""}`}>
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="badge bg-primary"
                    style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "3px 8px",
                        borderRadius: 6,
                    }}
                >
                    {tag}
                </span>
            ))}
        </div>
    );
};