import type { Event } from '../types';

// lat/lng derived from the prototype's x/y-percent placements against its
// fixed Pordenone bounding box (lat 45.948-45.966, lng 12.640-12.668).
const mockEvents: Event[] = [
  { id: 1, title: 'Municipal statute revised', date: '1841-03-12', draft: false, text: 'The town council adopts a revised statute governing local administration and tax collection.', url: '', image: '', lat: 45.9552, lng: 12.6498 },
  { id: 2, title: 'Cotton mill opens', date: '1844-06-03', draft: false, text: 'A new cotton mill begins operation along the Noncello, employing over two hundred workers.', url: 'https://example.org/cotton-mill', image: 'https://example.org/img/cotton-mill.jpg', lat: 45.95916, lng: 12.65624 },
  { id: 3, title: 'Rail survey commissioned', date: '1846-02-09', draft: true, text: 'Engineers begin surveying a possible rail line connecting Pordenone to Venice.', url: '', image: 'https://example.org/img/rail-survey.jpg', lat: 45.9561, lng: 12.65736 },
  { id: 4, title: 'National guard formed', date: '1848-03-22', draft: false, text: 'Local citizens form a national guard amid the wave of revolutions across Europe.', url: '', image: '', lat: 45.9579, lng: 12.6484 },
  { id: 5, title: 'Town council reinstated', date: '1848-10-05', draft: false, text: 'The elected town council resumes its duties after months of unrest.', url: 'https://example.org/council', image: '', lat: 45.9543, lng: 12.6512 },
  { id: 6, title: 'New hospital wing opens', date: '1850-04-18', draft: true, text: 'A new wing of the civic hospital opens, doubling its capacity for patients.', url: '', image: 'https://example.org/img/hospital.jpg', lat: 45.95844, lng: 12.6596 },
  { id: 7, title: 'Silk mill founded', date: '1853-07-02', draft: false, text: 'A silk-spinning enterprise is founded, part of a wave of textile investment in the region.', url: 'https://example.org/silk-mill', image: 'https://example.org/img/silk-mill.jpg', lat: 45.9561, lng: 12.647 },
  { id: 8, title: 'Bridge over the Noncello rebuilt', date: '1858-05-06', draft: false, text: 'The stone bridge over the Noncello river is rebuilt after decades of wear.', url: '', image: 'https://example.org/img/bridge.jpg', lat: 45.9525, lng: 12.65344 },
  { id: 9, title: 'Telegraph line connected', date: '1861-02-20', draft: true, text: 'Pordenone is connected to the national telegraph network for the first time.', url: 'https://example.org/telegraph', image: '', lat: 45.957, lng: 12.6568 },
  { id: 10, title: 'Plebiscite vote held', date: '1866-10-22', draft: false, text: 'Citizens vote overwhelmingly to join the Kingdom of Italy, ending Austrian rule over the city.', url: 'https://example.org/plebiscite', image: 'https://example.org/img/plebiscite.jpg', lat: 45.96024, lng: 12.65064 },
];

export default mockEvents;
