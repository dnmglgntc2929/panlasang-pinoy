import { useState } from "react";

import {
  AreaChart,
  Legend,
  Area,
  CartesianGrid,
  Tooltip,
  YAxis,
  XAxis,
} from "recharts";

export default function chart({ data }) {
  const [isSharp, setIsSharp] = useState(false);

  return (
    <div>
      <AreaChart
        width={500}
        height={300}
        data={data}
        onMouseOver={() => setIsSharp(!isSharp)}
        onMouseOut={() => setIsSharp(!isSharp)}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <Legend />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="visits" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </div>
  );
}
