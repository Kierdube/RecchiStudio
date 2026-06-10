import { applyEmailTemplate } from "@/lib/email-copy";

export type TemplateBodyLine =
  | { type: "row"; label: string; valueTemplate: string }
  | { type: "block"; label: string; token: string; suffix?: string }
  | { type: "embed"; token: string; tableHeaders?: [string, string, string] }
  | { type: "text"; content: string }
  | { type: "cta"; label: string };

export type ParsedEmailTemplate = {
  subject: string;
  brandTitle: string;
  brandTagline: string;
  eyebrow: string;
  headline: string;
  body: TemplateBodyLine[];
};

const TOKEN_LINE = /^\{([a-zA-Z]+)\}(.*)$/;

function nonEmptyLines(template: string): string[] {
  return template.replace(/\r\n/g, "\n").split("\n");
}

function splitTableHeaders(line: string): [string, string, string] | null {
  const parts = line.split("|").map((part) => part.trim());
  if (parts.length !== 3 || parts.some((part) => !part)) return null;
  return [parts[0], parts[1], parts[2]];
}

export function parseEmailTemplate(template: string): ParsedEmailTemplate {
  const lines = nonEmptyLines(template);
  let index = 0;

  const subjectLine = lines[index++] ?? "";
  const subject = subjectLine.replace(/^Subject:\s*/i, "").trim();

  while (index < lines.length && !lines[index].trim()) index++;

  const brandTitle = lines[index++]?.trim() ?? "";
  const brandTagline = lines[index++]?.trim() ?? "";

  while (index < lines.length && !lines[index].trim()) index++;

  const eyebrow = lines[index++]?.trim() ?? "";
  const headline = lines[index++]?.trim() ?? "";

  const body: TemplateBodyLine[] = [];
  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";
    if (!line) {
      index++;
      continue;
    }

    if (line.startsWith("[") && line.endsWith("]")) {
      body.push({ type: "cta", label: line.slice(1, -1).trim() });
      index++;
      continue;
    }

    const tokenOnly = line.match(TOKEN_LINE);
    if (tokenOnly && tokenOnly[1] && tokenOnly[2] === "") {
      const previous = body.at(-1);
      const tableHeaders =
        previous?.type === "text" ? splitTableHeaders(previous.content) : null;
      if (tableHeaders && previous?.type === "text") {
        body.pop();
        body.push({ type: "embed", token: tokenOnly[1], tableHeaders });
      } else {
        body.push({ type: "embed", token: tokenOnly[1] });
      }
      index++;
      continue;
    }

    if (line.includes(":")) {
      const colonIndex = line.indexOf(":");
      const label = line.slice(0, colonIndex).trim();
      const valueTemplate = line.slice(colonIndex + 1).trim();
      if (valueTemplate) {
        body.push({ type: "row", label, valueTemplate });
        index++;
        continue;
      }

      const next = lines[index + 1]?.trim() ?? "";
      const nextToken = next.match(TOKEN_LINE);
      if (nextToken) {
        body.push({
          type: "block",
          label,
          token: nextToken[1],
          suffix: nextToken[2]?.trim() || undefined,
        });
        index += 2;
        continue;
      }
    }

    const next = lines[index + 1]?.trim() ?? "";
    const nextToken = next.match(TOKEN_LINE);
    if (nextToken) {
      body.push({
        type: "block",
        label: line,
        token: nextToken[1],
        suffix: nextToken[2]?.trim() || undefined,
      });
      index += 2;
      continue;
    }

    body.push({ type: "text", content: line });
    index++;
  }

  return { subject, brandTitle, brandTagline, eyebrow, headline, body };
}

export function renderTemplatePlainText(
  template: string,
  vars: Record<string, string | null | undefined>,
): string {
  const lines = nonEmptyLines(template);
  const rendered = lines
    .map((line) => applyEmailTemplate(line, vars))
    .filter((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return line.trim().length > 0;
      return line.slice(colonIndex + 1).trim().length > 0;
    });
  return rendered.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function substituteTemplateValue(
  valueTemplate: string,
  vars: Record<string, string | null | undefined>,
): string {
  return applyEmailTemplate(valueTemplate, vars);
}
