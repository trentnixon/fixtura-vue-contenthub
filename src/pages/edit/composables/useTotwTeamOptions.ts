import { computed } from "vue";
import { useAccountStore } from "@/store/account";
import type { RelatedClub } from "@/types/account";

const DEFAULT_LOGO = {
  url: "https://fixtura.s3.ap-southeast-2.amazonaws.com/Default_ICON_171b58a21b.png",
  width: 800,
  height: 800,
};

/**
 * Team options for TOTW edit:
 * - Association: all related clubs from fetchRelatedClubsAction
 * - Club account: the club's own organisation (single option)
 */
export function useTotwTeamOptions() {
  const accountState = useAccountStore();

  const teamOptions = computed<RelatedClub[]>(() => {
    const relatedClubs = accountState.getRelatedClubsLogos ?? [];
    if (relatedClubs.length > 0) {
      return relatedClubs;
    }

    if (accountState.getAccountType === 1) {
      const org = accountState.getOrganizationDetails;
      if (org?.Name) {
        return [
          {
            id: org.id,
            name: org.Name,
            logo: {
              url: org.ParentLogo || DEFAULT_LOGO.url,
              width: DEFAULT_LOGO.width,
              height: DEFAULT_LOGO.height,
            },
          },
        ];
      }
    }

    return [];
  });

  const showTeamPicker = computed(() => teamOptions.value.length > 0);
  const isClubAccount = computed(() => accountState.getAccountType === 1);
  const isSingleTeamOption = computed(() => teamOptions.value.length === 1);

  return {
    teamOptions,
    showTeamPicker,
    isClubAccount,
    isSingleTeamOption,
  };
}
