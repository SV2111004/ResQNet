const roadConnections = {
  sector18: [
    "sector37",
    "mayurvihar",
  ],

  sector37: [
    "sector18",
    "sector62",
    "sector76",
  ],

  sector62: [
    "sector37",
    "indirapuram",
    "sector76",
  ],

  sector76: [
    "sector37",
    "sector62",
    "sector137",
  ],

  sector137: [
    "sector76",
    "sector142",
  ],

  sector142: [
    "sector137",
    "parichowk",
  ],

  parichowk: [
    "sector142",
    "knowledgepark",
    "alpha1",
  ],

  knowledgepark: [
    "parichowk",
    "beta1",
  ],

  alpha1: [
    "parichowk",
    "beta1",
  ],

  beta1: [
    "alpha1",
    "knowledgepark",
  ],

  indirapuram: [
    "sector62",
    "vaishali",
  ],

  vaishali: [
    "indirapuram",
    "kaushambi",
  ],

  kaushambi: [
    "vaishali",
    "anandvihar",
  ],

  anandvihar: [
    "kaushambi",
    "mayurvihar",
  ],

  mayurvihar: [
    "anandvihar",
    "akshardham",
    "sector18",
  ],

  akshardham: [
    "mayurvihar",
    "laxminagar",
  ],

  laxminagar: [
    "akshardham",
    "ito",
  ],

  ito: [
    "laxminagar",
  ],
};

module.exports =
  roadConnections;