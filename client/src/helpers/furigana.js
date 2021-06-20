import { Furigana } from 'gem-furigana'

export const generateRubyAnnotationString = (string) => {
  const furigana = new Furigana(string)
  return furigana.ReadingHtml
}
