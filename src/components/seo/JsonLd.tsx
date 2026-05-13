import type { Thing, WithContext } from "schema-dts";

/**
 * Render JSON-LD structured data.
 *
 * Pattern: React renders the JSON string as the script element's text child.
 * The browser does NOT execute scripts of type "application/ld+json", so this
 * is safe for our purposes. Google's crawler reads the textContent and parses
 * as JSON.
 *
 * If validation tools (e.g., Google Rich Results Test) report parse failures
 * in production due to HTML entity encoding of < > & in JSON string values,
 * switch to the React.createElement variant with a property name built at
 * runtime — see plan Task 8 implementer notes for the exact workaround.
 */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(data)}
    </script>
  );
}
