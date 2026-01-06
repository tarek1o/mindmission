import { ActionEnum } from '../enums/action.enum';

export const ActionDependencies: Partial<Record<ActionEnum, ActionEnum[]>> =
  Object.freeze({
    [ActionEnum.LIST]: [],
    [ActionEnum.SEARCH]: [ActionEnum.LIST],
    [ActionEnum.ADD]: [ActionEnum.LIST],
    [ActionEnum.EDIT]: [ActionEnum.LIST],
    [ActionEnum.DELETE]: [ActionEnum.LIST],
  });
