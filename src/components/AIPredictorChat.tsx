export function AIPredictorChat({ initialPrompt }: { initialPrompt?: string }) {
  void initialPrompt;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">🤖</div>
        <h3 className="text-white font-bold text-lg mb-2">AI Agent Not Connected</h3>
        <p className="text-white/40 text-sm">
          Will be added via the Agent Building Block from @aws-blocks/blocks.
        </p>
      </div>
    </div>
  );
}
