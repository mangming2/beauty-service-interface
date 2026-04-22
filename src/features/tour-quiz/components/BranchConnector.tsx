"use client";

type BranchConnectorProps = {
  animateKey: string;
};

export function BranchConnector({ animateKey }: BranchConnectorProps) {
  return (
    <div className="relative flex h-6 min-w-[64px] flex-1 items-center">
      <div className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-pink-200/40 bg-pink-300 shadow-[0_0_0_6px_rgba(249,37,149,0.12)]" />
      <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-cyan-100/40 bg-cyan-200 shadow-[0_0_0_6px_rgba(125,211,252,0.12)]" />
      <div className="absolute left-2 top-1/2 h-px w-[calc(100%-1rem)] -translate-y-1/2 bg-white/10" />
      <div
        key={animateKey}
        className="absolute left-2 top-1/2 h-[2px] w-[calc(100%-1rem)] -translate-y-1/2 origin-left bg-[linear-gradient(90deg,_rgba(249,37,149,0.95),_rgba(153,246,228,0.85))] animate-[routeSweep_720ms_ease-out_forwards]"
      />
    </div>
  );
}
