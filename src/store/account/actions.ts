import { useSchedulerStore } from "../scheduler";
import { useOrdersStore } from "../orders";
import { useAssociationStore } from "../associationStore/index";
import { useClubStore } from "../clubStore/index";
import { fetchAccountDetailsFromService } from "./service";
import { usePrivateAccountState } from "./private";
import { Association, Club, Order } from "@/types"; // Import necessary types

export async function fetchAccountDetails(id: number) {
  const state = usePrivateAccountState();
  try {
    state.loading = true;
    const response = await fetchAccountDetailsFromService(id);
    if (response && response.data) {
      state.accountDetails = response.data;
      const { attributes } = state.accountDetails;
      state.selectedAccount = {
        updatedAt: attributes.updatedAt,
        publishedAt: attributes.publishedAt,
        isActive: attributes.isActive,
        FirstName: attributes.FirstName,
        LastName: attributes.LastName,
        DeliveryAddress: attributes.DeliveryAddress,
        isSetup: attributes.isSetup,
        isUpdating: attributes.isUpdating,
        hasCompletedStartSequence: attributes.hasCompletedStartSequence,
        isRightsHolder: attributes.isRightsHolder,
        isPermissionGiven: attributes.isPermissionGiven,
        group_assets_by: attributes.group_assets_by,
        Sport: attributes.Sport,
        hasCustomTemplate: attributes.hasCustomTemplate,
        scheduler: attributes.scheduler,
        orders: attributes.orders,
        associations: attributes.associations,
        clubs: attributes.clubs,
        renders: attributes.renders, // Add renders
        account_type: attributes.account_type,
        render_token: attributes.render_token,
        template: attributes.template,
        theme: attributes.theme,
        trial_instance: attributes.trial_instance,
        subscription_tier: attributes.subscription_tier,
        sponsors: attributes.sponsors,
      };

      // Fetch and set the scheduler
      if (attributes.scheduler) {
        const schedulerStore = useSchedulerStore();
        schedulerStore.setScheduler(attributes.scheduler.data);
      }

      // Fetch and set the orders
      if (attributes.orders) {
        const ordersStore = useOrdersStore();
        const orderIds = attributes.orders.data.map((order: Order) => order.id);
        ordersStore.setOrders(orderIds);
      }

      // Fetch and set the associations
      if (attributes.associations) {
        const associationStore = useAssociationStore();
        const associationIds = attributes.associations.data.map(
          (association: Association) => association.id
        );
        associationIds.forEach((id) => {
          associationStore.fetchAssociation(id);
        });
      }

      // Fetch and set the clubs
      if (attributes.clubs) {
        const clubStore = useClubStore();
        const clubIds = attributes.clubs.data.map((club: Club) => club.id);
        clubIds.forEach((id) => {
          clubStore.fetchClub(id);
        });
      }

      // Fetch and set the renders
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
