import { BaseBiasScene } from './BaseBiasScene.js';

export class ConfirmationBiasScene extends BaseBiasScene {
    constructor() { super('confirmation_bias'); }
}

export class LossAversionScene extends BaseBiasScene {
    constructor() { super('loss_aversion'); }
}

export class AnchoringBiasScene extends BaseBiasScene {
    constructor() { super('anchoring_bias'); }
}

export class AvailabilityHeuristicScene extends BaseBiasScene {
    constructor() { super('availability_heuristic'); }
}

export class HindsightBiasScene extends BaseBiasScene {
    constructor() { super('hindsight_bias'); }
}

export class OverconfidenceBiasScene extends BaseBiasScene {
    constructor() { super('overconfidence_bias'); }
}

export class SelfServingBiasScene extends BaseBiasScene {
    constructor() { super('self_serving_bias'); }
}

export class StatusQuoBiasScene extends BaseBiasScene {
    constructor() { super('status_quo_bias'); }
}

export class NegativityBiasScene extends BaseBiasScene {
    constructor() { super('negativity_bias'); }
}

export class ThemVsUsBiasScene extends BaseBiasScene {
    constructor() { super('them_vs_us_bias'); }
}
