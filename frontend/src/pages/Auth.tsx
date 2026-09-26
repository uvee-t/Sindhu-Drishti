import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, MapPin, ShieldCheck, UserRound } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authApi, authErrorMessage } from '../services/authApi'
import { useSession } from '../contexts/SessionContext'
import '../auth.css'

type Field = 'fullname' | 'email' | 'distCode' | 'password'
type FormValues = Record<Field, string>
type FormErrors = Partial<Record<Field, string>>
const emptyForm: FormValues = { fullname: '', email: '', distCode: '', password: '' }
const districtCodes = Array.from({ length: 13 }, (_, index) => String(index + 1))

function validate(values: FormValues, register: boolean): FormErrors {
  const errors: FormErrors = {}
  if (register && values.fullname.trim().length < 2) errors.fullname = 'Enter your full name.'
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address.'
  if (!values.distCode.trim()) errors.distCode = 'Enter your district code.'
  if (values.password.length < 6) errors.password = 'Password must be at least 6 characters.'
  return errors
}

function FieldLabel({ children }: { children: React.ReactNode }) { return <span className="auth-label">{children}</span> }
function TextField({ label, icon, type = 'text', value, onChange, error, autoComplete }: { label: string; icon: React.ReactNode; type?: string; value: string; onChange: (value: string) => void; error?: string; autoComplete?: string }) {
  return <label className={`auth-field ${error ? 'has-error' : ''}`}><FieldLabel>{label}</FieldLabel><span className="auth-input-wrap">{icon}<input type={type} value={value} onChange={event => onChange(event.target.value)} autoComplete={autoComplete} aria-invalid={Boolean(error)} /></span>{error && <small className="auth-field-error">{error}</small>}</label>
}

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const location = useLocation()
  const registration = location.state as { registered?: boolean; email?: string; sessionExpired?: boolean; sessionMessage?: string } | null
  const { refresh } = useSession()
  const [values, setValues] = useState<FormValues>(() => ({ ...emptyForm, email: !isRegister && registration?.email ? registration.email : '' }))
  const [errors, setErrors] = useState<FormErrors>({})
  const [notice, setNotice] = useState(!isRegister && registration?.registered ? 'Account created. Sign in to continue.' : !isRegister && registration?.sessionExpired ? registration.sessionMessage || 'Your session has expired. Please sign in again.' : '')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const update = (field: Field, value: string) => { setValues(current => ({ ...current, [field]: value })); setErrors(current => ({ ...current, [field]: undefined })); setNotice('') }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values, isRegister)
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    setLoading(true); setNotice('')
    try {
      if (isRegister) { await authApi.register(values); navigate('/login', { replace: true, state: { registered: true, email: values.email } }) }
      else { await authApi.login({ email: values.email, distCode: values.distCode, password: values.password }); await refresh(); navigate('/dashboard', { replace: true }) }
    } catch (error) { setNotice(authErrorMessage(error)) } finally { setLoading(false) }
  }
  return <main className="auth-page">
    <section className="auth-briefing" aria-label="Sindhu Drishti overview">
      <Link to="/login" className="auth-brand"><span><Eye size={23} /></span><div><strong>SINDHU DRISHTI</strong><small>GIS • AI • DISASTER INTELLIGENCE</small></div></Link>
      <div className="auth-briefing-copy"><p className="auth-overline">DISASTER RESPONSE PLATFORM</p><h1>Clarity when every moment matters.</h1><p>Bring district intelligence, risk mapping, and response planning into one secure operational view.</p></div>
      <div className="auth-features"><div><span><MapPin size={18} /></span><p><b>Location intelligence</b><small>Identify risk and safer areas quickly.</small></p></div><div><span><ShieldCheck size={18} /></span><p><b>Protected operations</b><small>Access is limited to verified responders.</small></p></div></div>
      <p className="auth-footer">© {new Date().getFullYear()} Sindhu Drishti · Emergency Intelligence Network</p>
    </section>
    <section className="auth-panel"><div className="auth-card">
      <div className="auth-mobile-brand"><span><Eye size={21} /></span><b>SINDHU DRISHTI</b></div>
      <p className="auth-overline">{isRegister ? 'NEW RESPONDER ACCESS' : 'WELCOME BACK'}</p><h2>{isRegister ? 'Create your workspace access' : 'Sign in to your workspace'}</h2><p className="auth-subtitle">{isRegister ? 'Register with your official district details.' : 'Use your verified district credentials to continue.'}</p>
      <form className="auth-form" onSubmit={submit} noValidate>
        {isRegister && <TextField label="Full name" icon={<UserRound size={17} />} value={values.fullname} onChange={value => update('fullname', value)} error={errors.fullname} autoComplete="name" />}
        <TextField label="Official email" icon={<Mail size={17} />} type="email" value={values.email} onChange={value => update('email', value)} error={errors.email} autoComplete="email" />
        <label className={`auth-field ${errors.distCode ? 'has-error' : ''}`}><FieldLabel>District code</FieldLabel><span className="auth-input-wrap"><MapPin size={17} /><select value={values.distCode} onChange={event => update('distCode', event.target.value)} autoComplete="organization" aria-invalid={Boolean(errors.distCode)}><option value="" disabled>Select district code</option>{districtCodes.map(code => <option value={code} key={code}>District code {code}</option>)}</select></span>{errors.distCode && <small className="auth-field-error">{errors.distCode}</small>}</label>
        <label className={`auth-field ${errors.password ? 'has-error' : ''}`}><FieldLabel>Password</FieldLabel><span className="auth-input-wrap"><LockKeyhole size={17} /><input type={showPassword ? 'text' : 'password'} value={values.password} onChange={event => update('password', event.target.value)} autoComplete={isRegister ? 'new-password' : 'current-password'} aria-invalid={Boolean(errors.password)} /><button type="button" className="password-toggle" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{errors.password && <small className="auth-field-error">{errors.password}</small>}</label>
        {notice && <p className="auth-error" style={registration?.registered ? { color: '#267457', background: '#eaf7ef' } : undefined} role="alert">{registration?.registered ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}{notice}</p>}
        <button className="auth-submit" disabled={loading} type="submit">{loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}{!loading && <ArrowRight size={17} />}</button>
      </form>
      <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to Sindhu Drishti?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
      {!isRegister && <p className="auth-security"><CheckCircle2 size={15} /> Secure, district-level access</p>}
    </div></section>
  </main>
}
