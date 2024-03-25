import ProcessShowcase, { ProcessShowcase_Query, type ProcessShowcaseTypes } from './_blogPost/ProcessShowcase';
import QuoteSection, { QuoteSection_Query, type QuoteSectionTypes } from './_blogPost/QuoteSection';

type PortableContentMap = {
  ProcessShowcase: ProcessShowcaseTypes;
  QuoteSection: QuoteSectionTypes;
};

export type PortableContentTypes = PortableContentMap[keyof PortableContentMap] & { _type: string };

export default function PortableContent({ data }: { data: PortableContentTypes[] }) {
  return data?.map((item) => {
    const portableContentType = item._type as keyof PortableContentMap;
    const portableContentMap: Record<string, React.ReactNode> = {
      ProcessShowcase: <ProcessShowcase {...(item as ProcessShowcaseTypes)} />,
      QuoteSection: <QuoteSection {...(item as QuoteSectionTypes)} />,
    };
    const DynamicComponent = portableContentMap[portableContentType];
    if (!DynamicComponent) {
      return null;
    }
    return DynamicComponent;
  });
}

export const PortableContent_Query = /* groq */ `
  content[] {
    _type,
    ${ProcessShowcase_Query}
    ${QuoteSection_Query}
  }`;
