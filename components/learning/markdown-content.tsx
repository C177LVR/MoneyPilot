import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders lesson markdown with styling matched to the design system. */
export function MarkdownContent({ children }: { children: string }) {
  return (
    <div className="max-w-none text-sm leading-relaxed sm:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ ...props }) => (
            <h2
              className="mb-3 mt-8 font-display text-xl font-bold first:mt-0"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3 className="mb-2 mt-6 font-display text-lg font-semibold" {...props} />
          ),
          p: ({ ...props }) => <p className="mb-4 text-muted-foreground" {...props} />,
          strong: ({ ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="mb-4 ml-1 list-disc space-y-1.5 pl-4 text-muted-foreground" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="mb-4 ml-1 list-decimal space-y-1.5 pl-4 text-muted-foreground" {...props} />
          ),
          li: ({ ...props }) => <li className="pl-1" {...props} />,
          a: ({ ...props }) => (
            <a
              className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
              {...props}
            />
          ),
          em: ({ ...props }) => <em className="italic" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
