import { ChangePasswordForm } from './_components/change-password-form';

export default async function ForgetPasswordExecutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <section>
      <ChangePasswordForm token={slug} />
    </section>
  );
}
