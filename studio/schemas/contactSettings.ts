export default {
  name: 'contactSettings',
  title: 'Contact Settings',
  type: 'document',
  fields: [
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Include country code, e.g., +27 817517844',
    },
    {
      name: 'bookingLink',
      title: 'Booking Link (Discovery Call)',
      type: 'url',
    },
    {
      name: 'lineArtImage',
      title: 'Header Line Art Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Upload the decorative line art (e.g., buffalo) used in the contact header.',
    },
    {
      name: 'backgroundImage',
      title: 'Contact Page Background Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Used as the full-page background for the contact form',
    },
  ],
}
