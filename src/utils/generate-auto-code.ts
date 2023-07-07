type EntityPrefix = 'SE' | 'ISE' | 'RSE' | 'PSE';

const counters: Record<EntityPrefix, number> = {
  SE: 0,
  ISE: 0,
  RSE: 0,
  PSE: 0,
};

export function generateAutoCode(prefix: EntityPrefix): string {
  counters[prefix]++;
  const formattedCounter = counters[prefix].toString().padStart(3, '0');
  const formattedID = `${prefix}${formattedCounter}`;
  return formattedID;
}
