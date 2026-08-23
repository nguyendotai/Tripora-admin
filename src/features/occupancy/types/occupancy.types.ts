/** V9 vòng 8 — GET /occupancy/mine, 1 phần tử/1 ngày trong 30 ngày gần nhất. */
export interface OccupancyDayPoint {
  date: string;
  capacity: number;
  booked: number;
  rate: number;
}
