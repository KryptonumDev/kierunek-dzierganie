import type { PurchaseEligibilityRef, PurchaseEligibilitySource } from '@/global/types';

export function normalizePurchaseEligibility(
  sources?: Array<PurchaseEligibilitySource | null | undefined> | null
): PurchaseEligibilityRef[] {
  const deduplicated = new Map<string, PurchaseEligibilityRef>();

  sources?.forEach((source) => {
    if (!source?._id) return;

    deduplicated.set(source._id, {
      _id: source._id,
      name: source.name,
      type: source.type,
    });

    source.includedByPrograms?.forEach((program) => {
      if (!program?._id) return;

      deduplicated.set(program._id, {
        _id: program._id,
        name: program.name,
        type: program.type,
      });
    });
  });

  return Array.from(deduplicated.values());
}

export function hasSatisfiedPurchaseEligibility({
  eligibility,
  ownedCourseIds,
  cartProductIds,
}: {
  eligibility?: Array<PurchaseEligibilityRef | null | undefined> | null;
  ownedCourseIds?: string[] | null;
  cartProductIds?: string[] | null;
}) {
  if (!eligibility?.length) return true;

  const ownedIds = new Set(ownedCourseIds ?? []);
  const cartIds = new Set(cartProductIds ?? []);

  return eligibility.some((item) => {
    if (!item?._id) return false;

    return ownedIds.has(item._id) || cartIds.has(item._id);
  });
}

export function getPurchaseEligibilityLabel(eligibility?: Array<PurchaseEligibilityRef | null | undefined> | null) {
  if (eligibility?.length === 1) {
    return eligibility[0]?.name ?? 'powiązanego kursu lub programu';
  }

  return 'powiązanego kursu lub programu';
}
