const locationKeywords = ['gombe', 'kasoa', 'accra'];
const propertyTypeKeywords = ['house', 'apartment', 'condo'];
const priceRangeKeywords = ['expensive', 'cheap', 'affordable'];

export function extractEntities(text) {
  const entities = {};

  if (locationKeywords.some(keyword => text.includes(keyword))) {
    entities.location = locationKeywords.find(keyword => text.includes(keyword));
  }

  if (propertyTypeKeywords.some(keyword => text.includes(keyword))) {
    entities.propertyType = propertyTypeKeywords.find(keyword => text.includes(keyword));
  }

  if (priceRangeKeywords.some(keyword => text.includes(keyword))) {
    entities.priceRange = priceRangeKeywords.find(keyword => text.includes(keyword));
  }

  return entities;
} 