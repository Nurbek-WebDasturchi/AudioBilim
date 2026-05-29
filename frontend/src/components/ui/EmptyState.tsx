import { Radio } from 'lucide-react';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-line bg-white/[0.03] p-8 text-center">
      <div>
        <Radio className="mx-auto mb-4 h-10 w-10 text-brand" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-white/60">{description}</p>
      </div>
    </div>
  );
}
