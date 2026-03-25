"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLogo from "../../../public/main-logo.png";
import { GoogleIcon } from "@/components/common/Icons";
import { AuthLoading } from "@/components/common";
import Image from "next/image";
import { GapY } from "../../components/ui/gap";
import { useGoogleLogin, useUser } from "@/queries/useAuthQueries";
import {
  useTestSignup,
  useTestSignupAdmin,
  useTestLogin,
} from "@/queries/useTestQueries";
import { useTranslation } from "@/hooks/useTranslation";

const isDev = process.env.NODE_ENV === "development";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [testSeed, setTestSeed] = useState("fe-qa-001");
  const [testAdminSeed, setTestAdminSeed] = useState("fe-admin-001");
  const [testEmail, setTestEmail] = useState("");

  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useUser();
  const googleLoginMutation = useGoogleLogin();
  const testSignupMutation = useTestSignup();
  const testSignupAdminMutation = useTestSignupAdmin();
  const testLoginMutation = useTestLogin();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      router.push("/my");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  if (!isHydrated) {
    return <AuthLoading />;
  }

  const handleGoogleLogin = async () => {
    try {
      setMessage("");
      await googleLoginMutation.mutateAsync();
    } catch (error: unknown) {
      setMessage((error as Error)?.message || t("login.loginError"));
    }
  };

  const handleGuestAccess = () => {
    router.push("/");
  };

  const handleTestSignup = () => {
    setMessage("");
    testSignupMutation.mutate(testSeed, {
      onSuccess: data => {
        setTestEmail(data.email);
        setMessage(t("login.signupSuccess") + ": " + data.email);
      },
      onError: (err: Error) => setMessage(err.message),
    });
  };

  const handleTestAdminSignup = () => {
    setMessage("");
    testSignupAdminMutation.mutate(testAdminSeed, {
      onSuccess: data => {
        setTestEmail(data.email);
        setMessage(t("login.signupSuccess") + " (ADMIN): " + data.email);
      },
      onError: (err: Error) => setMessage(err.message),
    });
  };

  const handleTestLogin = () => {
    if (!testEmail.trim()) {
      setMessage(t("login.testLoginEmailRequired"));
      return;
    }
    setMessage("");
    testLoginMutation.mutate(testEmail, {
      onSuccess: () => setMessage(t("login.loginSuccess")),
      onError: (err: Error) => setMessage(err.message),
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center pt-[360px]">
      <div className="text-center">
        <Image
          src={MainLogo}
          alt={t("common.mainLogo")}
          width={196}
          height={54}
        />
      </div>

      <div className="mt-[200px] text-center p-[12px]">
        <div className="text-center">
          <p className="h-[24px] text-disabled text-md">
            {t("login.socialLogin")}
          </p>
          <GapY size={8} />
          <div className="flex justify-center gap-x-[14px]">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoginMutation.isPending}
              className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoginMutation.isPending ? (
                <div className="w-[24px] h-[24px] border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon width={24} height={24} />
              )}
            </button>
          </div>
        </div>

        <GapY size={17} />

        <div className="text-center p-[12px] flex gap-4">
          <button
            onClick={handleGuestAccess}
            className="text-white text-md underline hover:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            {t("login.guestAccess")}
          </button>
        </div>

        {isDev && (
          <>
            <GapY size={24} />
            <div className="text-center p-4 rounded-lg border border-white/20 bg-white/5 max-w-[320px] mx-auto">
              <p className="text-disabled text-sm mb-3">
                {t("login.testLoginSection")}
              </p>
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-xs text-disabled block mb-1">
                    Seed (USER)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testSeed}
                      onChange={e => setTestSeed(e.target.value)}
                      placeholder={t("login.seedPlaceholder")}
                      className="flex-1 min-w-0 px-3 py-2 rounded bg-black/20 text-white text-sm outline-none focus:ring-1 focus:ring-white/50"
                    />
                    <button
                      type="button"
                      onClick={handleTestSignup}
                      disabled={testSignupMutation.isPending}
                      className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm whitespace-nowrap"
                    >
                      {testSignupMutation.isPending
                        ? "..."
                        : t("login.testUserSignup")}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-disabled block mb-1">
                    Seed (ADMIN)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testAdminSeed}
                      onChange={e => setTestAdminSeed(e.target.value)}
                      placeholder="fe-admin-001"
                      className="flex-1 min-w-0 px-3 py-2 rounded bg-black/20 text-white text-sm outline-none focus:ring-1 focus:ring-white/50"
                    />
                    <button
                      type="button"
                      onClick={handleTestAdminSignup}
                      disabled={testSignupAdminMutation.isPending}
                      className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm whitespace-nowrap"
                    >
                      {testSignupAdminMutation.isPending
                        ? "..."
                        : t("login.testAdminSignup")}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-disabled block mb-1">
                    Email → {t("login.testLogin")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={e => setTestEmail(e.target.value)}
                      placeholder={t("login.emailPlaceholder")}
                      className="flex-1 min-w-0 px-3 py-2 rounded bg-black/20 text-white text-sm outline-none focus:ring-1 focus:ring-white/50"
                    />
                    <button
                      type="button"
                      onClick={handleTestLogin}
                      disabled={testLoginMutation.isPending}
                      className="px-3 py-2 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm whitespace-nowrap"
                    >
                      {testLoginMutation.isPending
                        ? "..."
                        : t("login.testLogin")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {message && (
        <div className="mt-4 text-red-400 text-sm text-center">{message}</div>
      )}
    </div>
  );
}
