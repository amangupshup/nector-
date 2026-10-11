// Survey questions and offer. Shared by the page (window.NECTOR) and the API (require).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NECTOR = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const QUESTIONS = {
    a1: { field: 'homeServicesUsed', eyebrow: 'AT HOME · 1 OF 3', title: 'Which little luxuries would you call home for?', sub: 'Choose all that apply.', exclusive: 'none_yet',
      options: [['haircut_styling', 'Haircut or styling'], ['waxing_threading', 'Waxing or threading'], ['manicure_pedicure', 'Manicure or pedicure'], ['nail_extensions_art', 'Nail extensions or nail art'], ['facial_skincare', 'Facial or skincare'], ['massage_bodycare', 'Massage or body care'], ['none_yet', 'None of these yet']] },
    a2: { field: 'homeServicePainPoint', eyebrow: 'AT HOME · 2 OF 3', title: 'What could be better?', sub: 'Choose all that apply.', exclusive: 'already_great',
      options: [['reliability', 'Finding someone reliable'], ['hygiene_quality', 'Hygiene and quality'], ['limited_options', 'Limited service options'], ['inconsistent_pricing', 'Pricing that keeps changing'], ['time_slots', 'Getting a convenient time slot'], ['already_great', 'I already have a great experience']] },
    a3: { field: 'desiredAdditionalService', eyebrow: 'AT HOME · 3 OF 3', title: 'If you could add one more service to your usual booking, what would it be?', sub: 'Choose all that apply.', exclusive: 'nothing_extra',
      options: [['hand_foot_care', 'A little hand and foot care'], ['nail_colour_art', 'Nail colour, shaping, or nail art'], ['grooming_touchup', 'A quick grooming touch-up'], ['skincare_treatment', 'A relaxing skincare treatment'], ['head_body_massage', 'A head or body massage'], ['nothing_extra', 'Nothing extra for now']] },
    b1: { field: 'salonVisitFrequency', eyebrow: 'AT THE SALON · 1 OF 4', title: 'How often do you make time for a salon visit?', sub: 'Choose all that apply.',
      options: [['weekly', 'Every week'], ['every_2_3_weeks', 'Every 2–3 weeks'], ['monthly', 'Monthly'], ['every_2_3_months', 'Every 2–3 months'], ['special_occasions', 'Only for special occasions']] },
    b2: { field: 'salonPreferenceReason', eyebrow: 'AT THE SALON · 2 OF 4', title: 'What keeps you coming back to the salon?', sub: 'Choose all that apply.',
      options: [['trust_quality', 'I trust the quality of the service'], ['atmosphere_metime', 'I love the atmosphere and me-time'], ['equipment_options', 'Better equipment and more options'], ['get_the_look', "It's easier to get the look I want"], ['routine', "It's part of my regular routine"], ['no_trusted_home_option', "I haven't found an at-home option I trust"]] },
    b3: { field: 'homeConversionFactor', eyebrow: 'AT THE SALON · 3 OF 4', title: 'What would it take to bring that experience home?', sub: 'Choose all that apply.', exclusive: 'prefer_going_out',
      options: [['salon_quality', 'Salon-quality results'], ['trusted_professional', 'A professional I can trust'], ['hygiene_standards', 'Better hygiene standards'], ['affordable_price', 'A more affordable price'], ['premium_products', 'Premium products and equipment'], ['prefer_going_out', 'Nothing — I prefer going out']] },
    b4: { field: 'servicesOpenToTryingAtHome', eyebrow: 'AT THE SALON · 4 OF 4', title: 'If your favourite salon experience came to you, what would you be open to trying?', sub: 'Choose all that apply.', exclusive: 'prefer_salon',
      options: [['manicure_pedicure', 'Manicure or pedicure'], ['nail_shaping_colour_ext', 'Nail shaping, colour, or extensions'], ['waxing_threading', 'Waxing or threading'], ['hair_styling', 'Hair styling'], ['facial_skincare', 'Facial or skincare'], ['combo_visit', 'A combination of services in one visit'], ['prefer_salon', "I'd still prefer the salon"]] }
  };

  const BRANCH_STEPS = { home: ['a1', 'a2', 'a3'], salon: ['b1', 'b2', 'b3', 'b4'] };

  const OFFER = {
    code: 'NECTORFIRST',
    benefit: 'Enjoy one complimentary eligible service on your first booking.',
    terms: 'Valid on your first eligible booking, subject to service availability and offer terms.'
  };

  return { QUESTIONS, BRANCH_STEPS, OFFER };
});
