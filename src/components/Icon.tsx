import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { CalendarBlank } from '@phosphor-icons/react/CalendarBlank'
import { Check } from '@phosphor-icons/react/Check'
import { ClockCounterClockwise } from '@phosphor-icons/react/ClockCounterClockwise'
import { Code } from '@phosphor-icons/react/Code'
import { Copy } from '@phosphor-icons/react/Copy'
import { EyeSlash } from '@phosphor-icons/react/EyeSlash'
import { FileText } from '@phosphor-icons/react/FileText'
import { Globe } from '@phosphor-icons/react/Globe'
import { Hash } from '@phosphor-icons/react/Hash'
import { IdentificationCard } from '@phosphor-icons/react/IdentificationCard'
import { Link } from '@phosphor-icons/react/Link'
import { Lock } from '@phosphor-icons/react/Lock'
import { PaperPlaneTilt } from '@phosphor-icons/react/PaperPlaneTilt'
import { Question } from '@phosphor-icons/react/Question'
import { ShieldCheck } from '@phosphor-icons/react/ShieldCheck'
import { User } from '@phosphor-icons/react/User'
import type { ComponentPropsWithoutRef, ElementType } from 'react'

export type IconName =
  | 'activity'
  | 'arrowRight'
  | 'calendar'
  | 'check'
  | 'code'
  | 'copy'
  | 'credential'
  | 'eyeOff'
  | 'globe'
  | 'hash'
  | 'link'
  | 'lock'
  | 'proof'
  | 'question'
  | 'send'
  | 'shield'
  | 'user'
  | 'verify'

interface IconProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'ref'> {
  name: IconName
}

export function Icon({ name, ...props }: IconProps) {
  const icons: Record<IconName, ElementType> = {
    activity: ClockCounterClockwise,
    arrowRight: ArrowRight,
    calendar: CalendarBlank,
    check: Check,
    code: Code,
    copy: Copy,
    credential: IdentificationCard,
    eyeOff: EyeSlash,
    globe: Globe,
    hash: Hash,
    link: Link,
    lock: Lock,
    proof: FileText,
    question: Question,
    send: PaperPlaneTilt,
    shield: ShieldCheck,
    user: User,
    verify: ShieldCheck,
  }
  const PhosphorIcon = icons[name]

  return <PhosphorIcon aria-hidden="true" weight="regular" {...props} />
}
