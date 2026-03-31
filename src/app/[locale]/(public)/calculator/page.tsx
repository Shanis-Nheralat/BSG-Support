import CalculatorClient from './CalculatorClient';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Calculator' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CalculatorClient />;
}
