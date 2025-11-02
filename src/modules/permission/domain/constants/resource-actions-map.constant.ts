import { ActionEnum } from "../enums/action.enum"
import { ResourceEnum } from "../enums/resource.enum"

export const ResourceActionsMap: Record<ResourceEnum, ActionEnum[]> = Object.freeze({
  [ResourceEnum.BLOCK_USERS]: [ActionEnum.SEARCH, ActionEnum.LIST, ActionEnum.ADD, ActionEnum.DELETE],
  [ResourceEnum.PERMISSIONS]: [ActionEnum.LIST, ActionEnum.SEARCH, ActionEnum.ADD, ActionEnum.EDIT, ActionEnum.DELETE],
  [ResourceEnum.ROLES]: [ActionEnum.LIST, ActionEnum.SEARCH, ActionEnum.ADD, ActionEnum.EDIT, ActionEnum.DELETE],
  [ResourceEnum.USERS]: [ActionEnum.LIST, ActionEnum.SEARCH, ActionEnum.ADD, ActionEnum.EDIT, ActionEnum.DELETE],
  [ResourceEnum.USER_ROLES]: [ActionEnum.SEARCH, ActionEnum.LIST, ActionEnum.EDIT],
  [ResourceEnum.NOTIFICATION_SETTINGS]: [ActionEnum.LIST, ActionEnum.SEARCH, ActionEnum.ADD, ActionEnum.EDIT, ActionEnum.DELETE],
  [ResourceEnum.SUSPENDED_ACCOUNTS]: [ActionEnum.LIST, ActionEnum.SEARCH, ActionEnum.ADD, ActionEnum.EDIT, ActionEnum.DELETE],
});