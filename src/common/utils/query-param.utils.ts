import url from 'url'
import querystring, { ParsedUrlQuery } from 'querystring'

/* Get query params object */
export const parseQueryString = (rawUrl: string): ParsedUrlQuery => {
  let parsedUrl = url.parse(rawUrl)
  return querystring.parse(parsedUrl.query)
}
