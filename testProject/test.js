import test from 'ava'
import execa from 'execa'
import fs from 'fs'
import rimraf from 'rimraf'

test.after.always(() => {
  rimraf.sync('testProject/src/components/InvoiceItem')
})

test('cli tool', async (t) => {
  const { stdout, stderr } = await execa('./index.js', [
    '-n',
    'InvoiceItem',
    '-t',
    'component',
    'testProject/src/components',
  ])

  if (stderr) {
    t.log(stderr)
    t.fail('No error in console')
  }

  t.regex(stdout, /InvoiceItem/g, 'Created component is mentioned')

  const directories = fs.readdirSync('testProject/src/components')

  t.true(
    directories.includes('invoiceItem'),
    'Should create directory with correct case'
  )

  const files = fs.readdirSync('testProject/src/components/invoiceItem')

  t.true(
    files.includes('InvoiceItem.js') && files.includes('InvoiceItem.spec.js'),
    files.includes('subComponents'),
    'Should create file with correct case'
  )
})
