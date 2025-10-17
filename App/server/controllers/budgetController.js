const { generateWithDeepSeek } = require('../services/ollamaClient');

function buildPrompt(monthlyIncome, savingsGoal, notes) {
    const extras = notes ? `Additional notes: ${notes}` : 'No additional notes provided.';
    return (
`You are a budgeting coach. Be practical and specific.
User monthly income: ${monthlyIncome}
User monthly savings goal: ${savingsGoal}
${extras}

Tasks:
1) Provide a concise, human-readable monthly budget plan with allocations, percentages, and actionable steps. Prioritize meeting the savings goal. Include rationale where relevant.
2) Provide a Mermaid pie diagram that sums to the monthly income with categories labeled Savings, Needs, Wants (choose splits that make sense given the goal). Use only a fenced Mermaid block for the diagram.

Constraints:
- Avoid markdown in the advice text. Keep it plain text.
- The Mermaid block should be the only fenced block and must be valid Mermaid.
- The pie chart numbers should be exact dollars (integers) and sum to ${monthlyIncome}.
`);
}

function splitAdviceAndMermaid(responseText) {
    const fenceStart = responseText.indexOf('```');
    if (fenceStart === -1) {
        return { advice: responseText.trim(), diagramMermaid: '' };
    }
    const advice = responseText.slice(0, fenceStart).trim();
    const rest = responseText.slice(fenceStart + 3);
    const nextNewline = rest.indexOf('\n');
    let diagram = '';
    if (nextNewline !== -1) {
        const maybeLang = rest.slice(0, nextNewline).trim();
        const body = rest.slice(nextNewline + 1);
        const fenceEnd = body.indexOf('```');
        const mermaidBody = fenceEnd !== -1 ? body.slice(0, fenceEnd).trim() : body.trim();
        diagram = mermaidBody;
    }
    return { advice, diagramMermaid: diagram };
}

exports.plan = async (req, res) => {
    try {
        const { monthlyIncome, savingsGoal, notes } = req.body || {};
        if (typeof monthlyIncome !== 'number' || typeof savingsGoal !== 'number') {
            return res.status(400).json({ message: 'monthlyIncome and savingsGoal must be numbers' });
        }

        if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
            return res.status(400).json({ message: 'monthlyIncome must be a positive number' });
        }
        if (!Number.isFinite(savingsGoal) || savingsGoal < 0) {
            return res.status(400).json({ message: 'savingsGoal must be >= 0' });
        }
        if (savingsGoal > monthlyIncome) {
            return res.status(400).json({ message: 'savingsGoal cannot exceed monthlyIncome' });
        }

        const prompt = buildPrompt(monthlyIncome, savingsGoal, notes);
        const raw = await generateWithDeepSeek(prompt);
        const { advice, diagramMermaid } = splitAdviceAndMermaid(raw);
        return res.json({ advice, diagramMermaid });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to generate budget plan', error: String(err && err.message ? err.message : err) });
    }
};


