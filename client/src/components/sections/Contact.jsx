import { useRef, useState } from 'react';
import useReveal from '../../hooks/useReveal.js';
import { sendContact } from '../../lib/api.js';
import SocialLinks from '../ui/SocialLinks.jsx';

const empty = { name: '', email: '', subject: '', message: '', website: '' };
const fields = [['name', 'Name', 'text'], ['email', 'Email address', 'email'], ['subject', 'Subject', 'text']];

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.subject.trim().length < 3) e.subject = 'Please add a subject.';
  if (v.message.trim().length < 10) e.message = 'Message should be at least 10 characters.';
  return e;
}

export default function Contact() {
  const ref = useRef(null);
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  useReveal(ref);

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const onSubmit = async (e) => {
    e.preventDefault();
    if (status.state === 'loading') return;
    const local = validate(values);
    setErrors(local);
    if (Object.keys(local).length) return setStatus({ state: 'error', message: 'Please fix the highlighted fields.' });
    setStatus({ state: 'loading', message: 'Sending…' });
    try {
      await sendContact(values);
      setValues(empty);
      setStatus({ state: 'success', message: 'Thank you! Your message was sent. I will reply by email.' });
    } catch (err) {
      const fe = Object.fromEntries(Object.entries(err.fieldErrors || {}).map(([k, v]) => [k, v[0]]));
      setErrors(fe);
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <section id="contact" ref={ref} className="section">
      <div className="wrap">
      <p data-reveal className="label-amber">05 / Contact</p>
      <h2 data-reveal="blur" className="h2">Contact <em>me.</em></h2>
      <div className="mt-14 grid gap-14 md:grid-cols-[1fr_1.4fr]">
        <div data-reveal="left" className="text-stone">
          <p className="mx-auto max-w-xs md:mx-0">Have a project, an internship, or an idea? Send a note through the form, or find me on any of these.</p>
          <SocialLinks size="lg" className="mt-8 justify-center md:justify-start" labels />
        </div>
        <form data-reveal="right" onSubmit={onSubmit} noValidate className="grid gap-6 text-left">
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} /></label>
          </div>
          {fields.map(([name, label, type]) => (
            <div key={name}>
              <label htmlFor={name} className="label">{label}</label>
              <input id={name} name={name} type={type} value={values[name]} onChange={onChange} className="field" autoComplete={name === 'email' ? 'email' : name === 'name' ? 'name' : 'off'}
                aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-err` : undefined} />
              {errors[name] && <p id={`${name}-err`} className="mt-1 text-sm text-amber">{errors[name]}</p>}
            </div>
          ))}
          <div>
            <label htmlFor="message" className="label">Message</label>
            <textarea id="message" name="message" rows={5} value={values.message} onChange={onChange} className="field resize-none"
              aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-err' : undefined} />
            {errors.message && <p id="message-err" className="mt-1 text-sm text-amber">{errors.message}</p>}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
            <button type="submit" disabled={status.state === 'loading'} className="btn-pill disabled:opacity-50">
              {status.state === 'loading' ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span>
            </button>
            <p role={status.state === 'error' ? 'alert' : 'status'} aria-live="polite" className={`text-sm ${status.state === 'error' ? 'text-amber' : 'text-stone'}`}>{status.message}</p>
          </div>
        </form>
      </div>
      </div>
    </section>
  );
}
