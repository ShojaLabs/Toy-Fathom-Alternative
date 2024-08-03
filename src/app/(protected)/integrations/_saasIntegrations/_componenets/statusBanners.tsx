import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";

export function ConnectedBanner() {
  return (
    <div className="flex gap-1 justify-center text-green-600">
      <IconCircleCheckFilled size={24} />
      Connected
    </div>
  );
}

export function UnknownBanner() {
  return (
    <div className="flex gap-1 justify-center text-orange-400">
      <IconAlertTriangleFilled size={24} /> Unknown please, refresh!
    </div>
  );
}
