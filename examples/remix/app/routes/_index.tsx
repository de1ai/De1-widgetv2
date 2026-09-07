import { ClientOnly } from 'remix-utils/client-only'
import { Fallback } from '../components/Fallback'
import { De1Widget } from '../components/De1Widget'

export default function Index() {
  return (
    <ClientOnly fallback={<Fallback />}>{() => <De1Widget />}</ClientOnly>
  )
}
