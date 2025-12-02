import { runWebDataValidation } from './validate';

const GATEWAY_ERROR_PATTERN = /active on gateway but no rules/i;
const MAX_SAMPLE_ERRORS = 20;

function logGatewayErrors(errors: string[]) {
    console.error(`Gateway validation failed for ${errors.length} pricing entr${errors.length === 1 ? 'y' : 'ies'}:`);
    const samples = errors.slice(0, MAX_SAMPLE_ERRORS);
    for (const err of samples) {
        console.error(` - ${err}`);
    }
    if (errors.length > MAX_SAMPLE_ERRORS) {
        console.error(`   ...and ${errors.length - MAX_SAMPLE_ERRORS} more issues (showing first ${MAX_SAMPLE_ERRORS}).`);
    }
}

function runGatewayValidation() {
    const outcome = runWebDataValidation({ gatingSections: ['pricing'] });
    const pricingResult = outcome.results.find((result) => result.key === 'pricing');
    if (!pricingResult) {
        console.error('Unable to locate pricing results from data validation run.');
        process.exit(1);
    }
    const gatewayErrors = pricingResult.errors.filter((error) => GATEWAY_ERROR_PATTERN.test(error));
    if (gatewayErrors.length > 0) {
        logGatewayErrors(gatewayErrors);
        process.exit(1);
    }
    console.log('Gateway validation passed. All active gateway models include pricing rules.');
}

if ('main' in import.meta && (import.meta as ImportMeta & { main?: unknown }).main) {
    runGatewayValidation();
}
