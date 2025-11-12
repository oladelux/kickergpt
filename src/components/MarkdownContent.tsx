import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

type MarkdownSize = "sm" | "base";

const textSizeClass: Record<MarkdownSize, string> = {
  sm: "text-sm",
  base: "text-base",
};

const buildComponents = (size: MarkdownSize): Components => {
  const sizeClass = textSizeClass[size];

  return {
    p: ({ children }) => (
      <p className={`${sizeClass} leading-relaxed text-current [&:not(:last-child)]:mb-2`}>
        {children}
      </p>
    ),
    strong: ({ children }) => <strong className="font-semibold text-current">{children}</strong>,
    em: ({ children }) => <em className="italic text-current">{children}</em>,
    ul: ({ children }) => (
      <ul className={`list-disc space-y-1 pl-5 ${sizeClass} leading-relaxed text-current`}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className={`list-decimal space-y-1 pl-5 ${sizeClass} leading-relaxed text-current`}>
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="[&>p]:m-0 text-current">{children}</li>,
    a: ({ children, href }) => (
      <a
        href={href ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="font-medium underline decoration-dotted underline-offset-4 text-primary"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-current">
        {children}
      </code>
    ),
  };
};

interface MarkdownContentProps {
  content: string;
  className?: string;
  size?: MarkdownSize;
}

export function MarkdownContent({ content, className, size = "sm" }: MarkdownContentProps) {
  return (
    <div className={cn("space-y-2 leading-relaxed", textSizeClass[size], className)}>
      <ReactMarkdown components={buildComponents(size)}>{content}</ReactMarkdown>
    </div>
  );
}
