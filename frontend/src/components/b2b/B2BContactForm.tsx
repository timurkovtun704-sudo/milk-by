
import { useState } from "react";

import type { FormEvent } from "react";

import { submitB2BContact } from "../../services/b2bService";

import {
  b2bMessages,
} from "../../i18n/b2bMessages";

import type { Locale } from "../../i18n/messages";

import "../../styles/b2b.css";

interface B2BContactFormProps {
  locale: Locale;
  productId?: number;
}

export default function B2BContactForm({
  locale,
  productId,
}: B2BContactFormProps) {
  const labels = b2bMessages[locale];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2 || message.trim().length < 10) {
  setIsSuccess(false);
  setErrorMessage(labels.errorDescription);
  return;
}
    setIsSubmitting(true);
    setIsSuccess(false);
    setErrorMessage(null);

    try {
      await submitB2BContact({
        name: name.trim(),
        email: email.trim(),
        ...(subject.trim()
          ? { subject: subject.trim() }
          : {}),
        message: message.trim(),
        ...(productId !== undefined
          ? { product_id: productId }
          : {}),
      });

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");

      setIsSuccess(true);
    } catch {
  setErrorMessage(labels.errorDescription);
} finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="b2b-contact"
      aria-labelledby="b2b-contact-title"
    >
      <div className="b2b-contact__content">
        <header className="b2b-contact__heading">
          <p className="eyebrow">{labels.eyebrow}</p>

          <h2 id="b2b-contact-title">
            {labels.title}
          </h2>

          <p>{labels.description}</p>
        </header>

        {isSuccess && (
          <div
            className="b2b-contact__notice b2b-contact__notice--success"
            role="status"
          >
            <strong>{labels.successTitle}</strong>
            <p>{labels.successDescription}</p>
          </div>
        )}

        {errorMessage && (
          <div
            className="b2b-contact__notice b2b-contact__notice--error"
            role="alert"
          >
            <strong>{labels.errorTitle}</strong>
            <p>{errorMessage}</p>
          </div>
        )}

        <form
          className="b2b-contact__form"
          onSubmit={handleSubmit}
        >
          <div className="b2b-contact__field">
            <label htmlFor="b2b-name">
              {labels.nameLabel}
            </label>

            <input
              id="b2b-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) =>
                setName(event.currentTarget.value)
              }
              minLength={2}
              maxLength={150}
              required
              disabled={isSubmitting}
              placeholder={labels.namePlaceholder}
            />
          </div>

          <div className="b2b-contact__field">
            <label htmlFor="b2b-email">
              {labels.emailLabel}
            </label>

            <input
              id="b2b-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.currentTarget.value)
              }
              maxLength={254}
              required
              disabled={isSubmitting}
              placeholder={labels.emailPlaceholder}
            />
          </div>

          <div className="b2b-contact__field">
            <label htmlFor="b2b-subject">
              {labels.subjectLabel}
            </label>

            <input
              id="b2b-subject"
              name="subject"
              type="text"
              value={subject}
              onChange={(event) =>
                setSubject(event.currentTarget.value)
              }
              maxLength={200}
              disabled={isSubmitting}
              placeholder={labels.subjectPlaceholder}
            />
          </div>

          <div className="b2b-contact__field">
            <label htmlFor="b2b-message">
              {labels.messageLabel}
            </label>

            <textarea
              id="b2b-message"
              name="message"
              value={message}
              onChange={(event) =>
                setMessage(event.currentTarget.value)
              }
              minLength={10}
              maxLength={5000}
              rows={6}
              required
              disabled={isSubmitting}
              placeholder={labels.messagePlaceholder}
            />
          </div>

          <p className="b2b-contact__hint">
            {labels.requiredHint}
          </p>

          <button
            className="button button--primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? labels.submitting
              : labels.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
