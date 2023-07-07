import { Product } from '@core/entities/product'
import {
  dermo,
  hygieneBuccoDentaire,
  medicaments,
  mumAndBaby
} from '@utils/testData/categoriesDemoPraden'

export const atoderm: Product = {
  name: 'Bioderma Atoderm Gel douche 1l',
  miniature:
    'https://www.pharmacieagnespraden.com/40313-small_default/bioderma-atoderm-gel-douche-1l.jpg',
  img: 'https://www.pharmacieagnespraden.com/40313-large_default/bioderma-atoderm-gel-douche-1l.jpg',
  categoryUuid: dermo.uuid,
  cip13: '3401399372926',
  priceWithoutTax: 742,
  percentTaxRate: 20,
  location: 'M1E29T2 / PALET 11',
  availableStock: 1124
}

export const ernst: Product = {
  name: "Ernst Richter's tisane transit 20 sachets",
  miniature:
    'https://www.pharmacieagnespraden.com/70394-small_default/ernst-richter-s-tis-poids-ideal-20sach.jpg',
  img: 'https://www.pharmacieagnespraden.com/70394-large_default/ernst-richter-s-tis-poids-ideal-20sach.jpg',
  categoryUuid: medicaments.uuid,
  cip13: '4066215003584',
  priceWithoutTax: 313,
  percentTaxRate: 5.5,
  location: 'M17E23T7 / 1E500',
  availableStock: 46
}

export const velvet: Product = {
  name: 'Scholl Velvet Smooth Express',
  miniature:
    'https://www.pharmacieagnespraden.com/72716-small_default/scholl-rape-elect-velvet-smooth.jpg',
  img: 'https://www.pharmacieagnespraden.com/72716-large_default/scholl-rape-elect-velvet-smooth.jpg',
  categoryUuid: medicaments.uuid,
  cip13: '5052197023350',
  priceWithoutTax: 1825,
  percentTaxRate: 20,
  location: 'R3C300',
  availableStock: 17
}

export const daflon: Product = {
  name: 'Daflon 500 mg 120 comprimés',
  miniature:
    'https://www.pharmacieagnespraden.com/58253-small_default/daflon-500-mg-cpr-120.jpg',
  img: 'https://www.pharmacieagnespraden.com/58253-large_default/daflon-500-mg-cpr-120.jpg',
  categoryUuid: medicaments.uuid,
  cip13: '3400927628146',
  priceWithoutTax: 1991,
  percentTaxRate: 10,
  location: 'M11E11T6',
  availableStock: 13
}

export const eauThermale: Product = {
  name: 'La Roche Posay Eau Thermale 300 ml',
  miniature:
    'https://www.pharmacieagnespraden.com/41550-small_default/la-roche-posay-eau-thermale-300ml.jpg',
  img: 'https://www.pharmacieagnespraden.com/41550-large_default/la-roche-posay-eau-thermale-300ml.jpg',
  categoryUuid: dermo.uuid,
  cip13: '3433422404403',
  priceWithoutTax: 658,
  percentTaxRate: 20,
  location: 'M15E2T5 / PALET 09',
  availableStock: 453
}

export const uriage: Product = {
  name: 'Uriage Bébé 1ère Eau Nettoyante 1 Litre',
  miniature:
    'https://www.pharmacie-du-centre-albert.fr/resize/100x100/media/finish/img/normal/30/3661434008726-uriage-1ere-eau-nettoyante-1-litre-a-l-edelweiss-bio.jpg',
  img: 'https://www.pharmacie-du-centre-albert.fr/resize/600x600/media/finish/img/normal/30/3661434008726-uriage-1ere-eau-nettoyante-1-litre-a-l-edelweiss-bio.jpg',
  categoryUuid: mumAndBaby.uuid,
  cip13: '3661434008726',
  priceWithoutTax: 658,
  percentTaxRate: 20,
  location: 'M15E2T4 / PALET 05',
  availableStock: 103
}

export const physiolac: Product = {
  name: 'Physiolac Bio Croissance',
  miniature:
    'https://www.pharmacieagnespraden.com/55241-small_default/physiolac-bio-croissance.jpg',
  img: 'https://cdn1.costatic.com/img/product/800/63370d315eb97/physiolac-bio-3-p25272.jpg',
  categoryUuid: mumAndBaby.uuid,
  cip13: '3518646124181',
  priceWithoutTax: 1573,
  percentTaxRate: 5.5,
  location: 'M15E7T7 / R3LAIT3',
  availableStock: 1106
}

export const dolodent: Product = {
  name: 'Dolodent solution 27g',
  miniature:
    'https://www.pharmacieagnespraden.com/img/tmp/product_mini_195_1.jpg',
  img: 'https://www.pharmacieagnespraden.com/52664-large_default/dolodent-solution-gingivale-27-g.jpg',
  categoryUuid: hygieneBuccoDentaire.uuid,
  cip13: '3400921929201',
  priceWithoutTax: 500,
  percentTaxRate: 10,
  location: 'DD02',
  availableStock: 59
}

export const aspro: Product = {
  categoryUuid: medicaments.uuid,
  name: 'Aspro 500 Effervescent 20 comprimés effervescents',
  priceWithoutTax: 445,
  percentTaxRate: 10,
  miniature:
    'https://www.pharmacieagnespraden.com/62953-large_default/aspro-500-effervescent-20-comprims-effervescents.jpg',
  img: 'https://www.pharmacieagnespraden.com/62953-large_default/aspro-500-effervescent-20-comprims-effervescents.jpg',
  location: 'M15E2T4',
  cip13: '3400932062454',
  availableStock: 3
}

export const hemoclar: Product = {
  categoryUuid: medicaments.uuid,
  name: 'Hemoclar 0,5% crème 30g',
  priceWithoutTax: 468,
  percentTaxRate: 10,
  miniature:
    'https://www.pharmacieagnespraden.com/66060-large_default/hemoclar-05-pour-cent-crme.jpg',
  img: 'https://www.pharmacieagnespraden.com/66060-large_default/hemoclar-05-pour-cent-crme.jpg',
  location: 'M15E57T',
  cip13: '3400930479308',
  availableStock: 131
}

export const nurofenComprime: Product = {
  categoryUuid: medicaments.uuid,
  name: 'Nurofen 200mg 20 comprimés enrobés',
  priceWithoutTax: 286,
  percentTaxRate: 10,
  miniature:
    'https://www.pharmacieagnespraden.com/42183-large_default/nurofen-200-mg.jpg',
  img: 'https://www.pharmacieagnespraden.com/42183-large_default/nurofen-200-mg.jpg',
  location: 'M267ET',
  cip13: '3400933964351',
  availableStock: 60
}

export const spedifen: Product = {
  categoryUuid: medicaments.uuid,
  name: 'SPEDIFEN 400 mg cp pellic',
  priceWithoutTax: 295,
  percentTaxRate: 10,
  miniature:
    'https://www.pharmacieagnespraden.com/45320-large_default/spedifen-400-mg-12-comprims-pelliculs.jpg',
  img: 'https://www.pharmacieagnespraden.com/45320-large_default/spedifen-400-mg-12-comprims-pelliculs.jpg',
  location: 'M764ET2',
  cip13: '3400936251892',
  availableStock: 142
}

export const apresShampooingGinbembre: Product = {
  categoryUuid: medicaments.uuid,
  name: 'Desert Essence Après Shampooing à la Pomme Verte et au Gingembre 237ml',
  priceWithoutTax: 625,
  percentTaxRate: 20,
  miniature:
    'https://www.pharmacieagnespraden.com/51568-large_default/desert-essence-apres-shampooing-a-la-pomme-verte-et-au-gingembre-237ml.jpg',
  img: 'https://www.pharmacieagnespraden.com/51568-large_default/desert-essence-apres-shampooing-a-la-pomme-verte-et-au-gingembre-237ml.jpg',
  location: 'PALET 09',
  cip13: '0718334337029',
  availableStock: 6
}

export const hydralin: Product = {
  categoryUuid: medicaments.uuid,
  name: 'Hydralin Gyn 100 ml',
  priceWithoutTax: 479,
  percentTaxRate: 20,
  img: 'https://www.pharmacieagnespraden.com/64178-large_default/hydralin-gyn-100ml.jpg',
  miniature:
    'https://www.pharmacieagnespraden.com/64178-large_default/hydralin-gyn-100ml.jpg',
  location: 'PALET 05',
  cip13: '3401320215322',
  availableStock: 48
}

export const galenic: Product = {
  categoryUuid: medicaments.uuid,
  name: 'Galénic Pur Lotion Yeux Waterproof 125 ml',
  priceWithoutTax: 825,
  percentTaxRate: 20,
  img: 'https://www.pharmacieagnespraden.com/67833-large_default/galenic-pur-lot-biph-douc-fl125ml1.jpg',
  miniature:
    'https://www.pharmacieagnespraden.com/67833-large_default/galenic-pur-lot-biph-douc-fl125ml1.jpg',
  location: 'PALET 02',
  cip13: '3282770107944',
  availableStock: 9
}

export const cremeRasage: Product = {
  categoryUuid: medicaments.uuid,
  name: 'Weleda Homme Crème à Raser 75ml',
  priceWithoutTax: 525,
  percentTaxRate: 20,
  img: 'https://www.pharmacieagnespraden.com/42494-large_default/weleda-homme-crme-raser-75ml.jpg',
  miniature:
    'https://www.pharmacieagnespraden.com/42494-large_default/weleda-homme-crme-raser-75ml.jpg',
  location: 'PALET 06',
  cip13: '3596206289112',
  availableStock: 20
}

export const physiodose: Product = {
  categoryUuid: medicaments.uuid,
  name: 'Gilbert Physiodose sérum physiologique 40 doses 5ml',
  priceWithoutTax: 166,
  percentTaxRate: 20,
  img: 'https://i.ibb.co/MRN8Q52/physiologique.jpg',
  miniature: 'https://i.ibb.co/MRN8Q52/physiologique.jpg',
  location: 'PALET 05',
  cip13: '3518646266638',
  availableStock: 348
}

export const sucette: Product = {
  categoryUuid: medicaments.uuid,
  priceWithoutTax: 325,
  percentTaxRate: 20,
  location: 'PALET 02',
  cip13: '3700763535302',
  availableStock: 5,
  name: 'Dodie Sucette Anatomique Garçon 0-2 mois',
  img: 'https://www.pharmacieagnespraden.com/60923-large_default/dodie-sucet-garcon-0-2-mois-a26.jpg',
  miniature:
    'https://www.pharmacieagnespraden.com/60923-large_default/dodie-sucet-garcon-0-2-mois-a26.jpg'
}

export const parodontax: Product = {
  categoryUuid: medicaments.uuid,
  name: 'Parodontax dentifrice original lot 2 x 75ml',
  priceWithoutTax: 583,
  percentTaxRate: 20,
  location: 'PALET 01',
  cip13: '3401347938594',
  availableStock: 79,
  miniature:
    'https://www.pharmacieagnespraden.com/64488-large_default/parodontax-dentifrice-original-duo-75ml.jpg',
  img: 'https://www.pharmacieagnespraden.com/64488-large_default/parodontax-dentifrice-original-duo-75ml.jpg'
}

export const dissolvurol: Product = {
  categoryUuid: medicaments.uuid,
  priceWithoutTax: 700,
  percentTaxRate: 20,
  location: 'PALET 04',
  cip13: '3401343812003',
  availableStock: 25,
  name: 'Dissolvurol Gel au Silicium 100ml',
  img: 'https://www.pharmacieagnespraden.com/47619-large_default/3401343812003.jpg',
  miniature:
    'https://www.pharmacieagnespraden.com/47619-large_default/3401343812003.jpg'
}

export const cinqCinq: Product = {
  name: 'CINQ SUR CINQ Roll-on Apaisant 7 ml',
  img: 'https://www.pharmacieagnespraden.com/50032-large_default/n-cinq-sur-cinq-roll-on-ap7ml1.jpg',
  miniature:
    'https://www.pharmacieagnespraden.com/50032-large_default/n-cinq-sur-cinq-roll-on-ap7ml1.jpg',
  categoryUuid: medicaments.uuid,
  priceWithoutTax: 462.5,
  percentTaxRate: 20,
  location: 'PALET 08',
  cip13: '3401563131540',
  availableStock: 459
}

export const quies: Product = {
  name: 'Quies Cure Oreille',
  img: 'https://www.pharmacieagnespraden.com/69781-large_default/quies-cure-oreille.jpg',
  miniature:
    'https://www.pharmacieagnespraden.com/69781-large_default/quies-cure-oreille.jpg',
  categoryUuid: medicaments.uuid,
  priceWithoutTax: 582.5,
  percentTaxRate: 20,
  location: 'PALET 08',
  cip13: '3435171461003',
  availableStock: 36
}

export const somatolineBandages: Product = {
  name: 'Somatoline Bandages Remodelant & Drainant',
  img: 'https://www.pharmacieagnespraden.com/69018-large_default/somatoline-bandages-kit-1ere-utilisat-2.jpg',
  miniature:
    'https://www.pharmacieagnespraden.com/69018-large_default/somatoline-bandages-kit-1ere-utilisat-2.jpg',
  categoryUuid: medicaments.uuid,
  priceWithoutTax: 1742,
  percentTaxRate: 20,
  location: 'PALET 08',
  cip13: '8002410067637',
  availableStock: 2
}
