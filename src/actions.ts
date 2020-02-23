/**
 * Convert a flat object to a query string
 * @param parameters A flat object
 * @param prefix Defaults to '?'
 */
export function queryString(parameters: { [key: string]: any }, prefix: string = "?"): string {
  if (!parameters) return "";

  const query: string = Object.keys(parameters)
    .map((key: string) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key]);
    })
    .join("&");

  return prefix + query;
}
