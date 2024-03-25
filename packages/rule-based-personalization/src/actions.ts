import { Lookup, createLookup } from "./lookups";
import { ContentEntryPosition, PzRuleActionHandler, PzRuleActionHandlers, ContentCriteriaMatchTypeHandler, ContentCriteriaMatchTypeHandlers } from "./types";

function createBoostActionHandler<TContentEntry>(): PzRuleActionHandler<TContentEntry> {
  return function (index: number, positions: ContentEntryPosition<TContentEntry>[]) {
    if (Array.isArray(positions) && positions.length > index && index >= 0) {
      const entryToBoost = positions[index];
      if (!entryToBoost) return;
      const currentPosition = entryToBoost.currentPosition;
      //
      //Get the new position for the entry. It should not 
      //be boosted ahead of any entries that were already 
      //boosted.
      let newPosition = 1;
      positions.forEach(position => {
        if (position.currentPosition === currentPosition) return;
        if (position.notes?.boosted === true) {
          if (position.currentPosition >= newPosition) {
            newPosition = position.currentPosition + 1;
          }
          return;
        }
        position.currentPosition = position.currentPosition + 1;
      })
      if (!entryToBoost.notes) {
        entryToBoost.notes = {};  
      }
      entryToBoost.notes.boosted = true;
      entryToBoost.currentPosition = newPosition;
    }
  }
}

function createHideActionHandler<TContentEntry>(): PzRuleActionHandler<TContentEntry> {
  return function (index: number, positions: ContentEntryPosition<TContentEntry>[]) {
    if (Array.isArray(positions) && positions.length > index && index >= 0) {
      const entryToHide = positions[index];
      if (entryToHide) {
        entryToHide.hide = true;
      }
    }
  }
}

export function createPzRuleActionLookup<TEntry>(pzRuleActionHandlers?: PzRuleActionHandlers<TEntry>): Lookup<PzRuleActionHandler<TEntry>> {
  const handlers: PzRuleActionHandlers<TEntry> = {};
  if (pzRuleActionHandlers) {
    Object.keys(pzRuleActionHandlers).forEach(key => {
      const handler = pzRuleActionHandlers[key];
      if (handler) {
        handlers[key] = handler;
      }
    });
  }
  if (!handlers.boost) {
    handlers.boost = createBoostActionHandler<TEntry>();
  }
  if (!handlers.hide) {
    handlers.hide = createHideActionHandler<TEntry>();
  }
  return createLookup<PzRuleActionHandler<TEntry>>({ elements: handlers });
}

function createAllContentCriteriaMatchTypeHandler<TValue>(): ContentCriteriaMatchTypeHandler<TValue> {
  return function (ruleValues: TValue[], contentValues: TValue[]) {
    return ruleValues.every(ruleValue => contentValues.includes(ruleValue));
  }
}

function createAnyContentCriteriaMatchTypeHandler<TValue>(): ContentCriteriaMatchTypeHandler<TValue> {
  return function (ruleValues: TValue[], contentValues: TValue[]) {
    return ruleValues.some(ruleValue => contentValues.includes(ruleValue));
  }
}

export function createContentCriteriaMatchTypeLookup<TValue>(contentCriteriaMatchHandlers?: ContentCriteriaMatchTypeHandlers<TValue>): Lookup<ContentCriteriaMatchTypeHandler<TValue>> {
  const handlers: ContentCriteriaMatchTypeHandlers<TValue> = {}
  if (contentCriteriaMatchHandlers) {
    Object.keys(contentCriteriaMatchHandlers).forEach(key => {
      const handler = contentCriteriaMatchHandlers[key];
      if (handler) {
        handlers[key] = handler;
      }
    });
  }
  if (!handlers.all) {
    handlers.all = createAllContentCriteriaMatchTypeHandler();
  }
  if (!handlers.any) {
    handlers.any = createAnyContentCriteriaMatchTypeHandler();
  }
  return createLookup<ContentCriteriaMatchTypeHandler<TValue>>({ elements: handlers });
}

export function sortContentEntryPositions<TEntry>(a: ContentEntryPosition<TEntry>, b: ContentEntryPosition<TEntry>): number {
  const aCurrent = a.currentPosition;
  const bCurrent = b.currentPosition;
  if (aCurrent < bCurrent) return -1;
  if (aCurrent > bCurrent) return 1;
  const aOriginal = a.originalPosition;
  const bOriginal = b.originalPosition;
  if (aOriginal < bOriginal) return -1;
  if (aOriginal > bOriginal) return 1;
  return 0;
}
