<template lang="pug">
div
  h2 Test Up2Pay
  .payment-form(v-if='up2payForm' v-html='up2payForm')
  div(v-else)
    ft-button(@click='createForm') Creer paiement
  div(v-if='up2payUrl && up2payForm')
    pre url: {{ up2payUrl }}
    pre form: {{ up2payForm }}
    p
      | Le formulaire est pr&ecirc;t. Cliquez sur &quot;Payer&quot; pour &ecirc;tre redirig&eacute; vers la
      | plateforme Up2Pay.
    form(:action='up2payUrl' method='POST')
      button(type='submit' @click='logFormSubmission') Payer
</template>

<script setup lang="ts">
import { Up2Pay } from '@highcanfly-club/up2pay'

const up2payUrl = ref('')
const up2payForm = ref('')

const createForm = async () => {
  console.log('on cree le form')
  const payment = Up2Pay.create({
    payboxSandbox: false,
    payboxSite: '1284395', // exemple
    payboxRang: '001', // exemple
    payboxIdentifiant: '260542563', // exemple
    payboxHmac:
      'D2BFB51AE5DFDFE1FB013E39E96C2D6BB55A6093F4055845E0121262495FF2BDFBA765EE6893312F4A86EC9C384C5276E8DB31EF513AAB83554BA94D59C54514', // faux exemple
    payboxEffectue: 'http://localhost:3000',
    payboxRefuse: 'http://localhost:3000',
    payboxAnnule: 'http://localhost:3000',
    payboxAttente: 'https://www.example.com/payment/waiting',
    payboxRepondreA: 'http://localhost:3000', // webhook de validation
    amount: 4990, // 49,90 euros => 4990
    email: 'ronan@example.com',
    firstname: 'Ronan',
    lastname: 'L.',
    address1: '18 route de Notre-Dame-de-la-Gorge',
    zipcode: '74170',
    city: 'Les Contamines-Montjoie',
    countrycode: '250', // FR
    totalquantity: '12',
    reference: '123456'
    // On force l'environnement "sandbox" (pré-prod) en surchargeant baseUrls
  })
  try {
    console.log('create form')
    const formObject = await payment.form()
    console.log('form created')
    up2payUrl.value = formObject.url
    up2payForm.value = formObject.form
  } catch (err) {
    console.error('Erreur lors de la création du formulaire Up2Pay:', err)
  }
}

const logFormSubmission = () => {
  console.log('Form submission triggered')
}
</script>

<style scoped>
.payment-form {
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  padding: 1rem;
}
</style>
