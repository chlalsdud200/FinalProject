<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>

<html class="light" lang="ko">
<head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />

    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&amp;family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap"
            rel="stylesheet" />

    <script id="tailwind-config">
        tailwind.config = {
            darkMode : "class",
            theme : {
                extend : {
                    "colors" : {
                        "secondary" : "#515f74",
                        "on-background" : "#191c1e",
                        "tertiary" : "#000a18",
                        "on-tertiary-fixed-variant" : "#27496b",
                        "primary-fixed-dim" : "#aec7f5",
                        "surface-container-lowest" : "#ffffff",
                        "inverse-surface" : "#2d3133",
                        "error" : "#ba1a1a",
                        "on-surface-variant" : "#44474e",
                        "tertiary-fixed-dim" : "#a9c9f2",
                        "primary" : "#00091b",
                        "on-error" : "#ffffff",
                        "on-secondary-fixed" : "#0d1c2e",
                        "on-primary" : "#ffffff",
                        "surface-tint" : "#465f87",
                        "tertiary-container" : "#00223e",
                        "secondary-container" : "#d2e1fa",
                        "background" : "#f7f9fb",
                        "primary-fixed" : "#d6e3ff",
                        "on-secondary-container" : "#556379",
                        "outline-variant" : "#c4c6cf",
                        "surface-variant" : "#e0e3e5",
                        "secondary-fixed" : "#d5e3fc",
                        "inverse-on-surface" : "#eff1f3",
                        "outline" : "#74777f",
                        "on-tertiary" : "#ffffff",
                        "on-surface" : "#191c1e",
                        "on-primary-container" : "#7089b3",
                        "surface-container" : "#eceef0",
                        "on-error-container" : "#93000a",
                        "surface-dim" : "#d8dadc",
                        "surface-bright" : "#f7f9fb",
                        "secondary-fixed-dim" : "#b9c7e0",
                        "on-tertiary-container" : "#6b8bb0",
                        "on-primary-fixed-variant" : "#2e476e",
                        "on-secondary-fixed-variant" : "#3a485c",
                        "inverse-primary" : "#aec7f5",
                        "surface-container-highest" : "#e0e3e5",
                        "surface-container-low" : "#f2f4f6",
                        "on-primary-fixed" : "#001b3c",
                        "surface" : "#f7f9fb",
                        "primary-container" : "#002045",
                        "on-secondary" : "#ffffff",
                        "on-tertiary-fixed" : "#001d36",
                        "surface-container-high" : "#e6e8ea",
                        "tertiary-fixed" : "#d1e4ff",
                        "error-container" : "#ffdad6"
                    },
                    "borderRadius" : {
                        "DEFAULT" : "0.125rem",
                        "lg" : "0.25rem",
                        "xl" : "0.5rem",
                        "full" : "0.75rem"
                    },
                    "fontFamily" : {
                        "headline" : [ "Inter", "Noto Sans KR" ],
                        "body" : [ "Inter", "Noto Sans KR" ],
                        "label" : [ "Inter", "Noto Sans KR" ]
                    }
                },
            },
        }
    </script>

    <style>
        .hero-gradient {
            background: linear-gradient(135deg, #00091b 0%, #002045 100%);
        }

        .tacs-login-icon {
            display: block;
            flex-shrink: 0;
        }

        .tacs-login-icon.is-hidden {
            display: none;
        }

        /* 텍스트 드래그(선택) 시 더 선명하게 보이도록 스타일 추가 */
        ::selection {
            background-color: #2563eb !important; /* Tailwind blue-600 */
            color: #ffffff !important;
        }
        input::selection {
            background-color: #2563eb !important;
            color: #ffffff !important;
        }
    </style>
</head>

<body class="bg-surface font-body text-on-surface antialiased">
<main class="flex min-h-screen w-full overflow-hidden">

    <!-- Left Section -->
    <section class="relative hidden lg:flex w-3/5 hero-gradient flex-col justify-between p-16 overflow-hidden">

        <div class="absolute inset-0 opacity-20 pointer-events-none">
            <img class="w-full h-full object-cover mix-blend-overlay"
                 data-alt="A sophisticated digital globe wireframe glowing in deep blue with interconnected data points and light streaks symbolizing global logistics and security."
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKBvKzKT0PUR1x_m_5h2iKWSna3tsFo2OJ7ONMZJTT-JzqjeH_BhyBGiJa7mejJhqMCwn3GBOVCfntODxI6N_fG4AMLUS_qlP0bO046fKgLa8wOunoGZM6PPdSn6D6C3Z7BhVREd99Y3WgFKQMHGodUv_AFykEOBmoWOXVs9U5LuQ0EZAFaS5lwM8zqhVmFcqxDrJ6tA6BkMa-5dsXfBLWV6lm9bj413gSqp3hDKfe9QBS1Gl4Hn34VhzTuxaQpJ9sdttPpTVsS4E" />
        </div>

        <div class="relative z-10 flex items-center space-x-4">
            <div class="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center">
                <svg class="tacs-login-icon w-7 h-7 text-primary" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3.25L5.5 5.8v5.35c0 4.25 2.7 7.95 6.5 9.15 3.8-1.2 6.5-4.9 6.5-9.15V5.8L12 3.25Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                    <path d="M9.25 12.05l1.75 1.75 3.85-4.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div>
                <h2 class="text-2xl font-black tracking-tighter text-white leading-none">TACS</h2>
                <p class="text-xs font-bold text-primary-fixed-dim tracking-widest uppercase">
                    Sentinel Systems
                </p>
            </div>
        </div>

        <div class="relative z-10 max-w-2xl">
            <div class="flex items-center space-x-3 mb-6">
                <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed"></span>
                        </span>
                    <span class="text-[10px] font-bold text-primary-fixed tracking-wider uppercase">
                            System Status: Active
                        </span>
                </div>
            </div>

            <h1 class="text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                통합 행정 관세 시스템 <span class="text-primary-fixed-dim">(TACS)</span>
            </h1>

            <p class="text-lg text-slate-300 leading-relaxed font-light">
                데이터 무결성과 실시간 모니터링을 통한 차세대 스마트 관세 행정 플랫폼.
                센티넬 엔진이 귀하의 자산과 정보를 안전하게 보호합니다.
            </p>
        </div>

        <div class="relative z-10"></div>
    </section>

    <!-- Right Section: Login Form -->
    <section class="w-full lg:w-2/5 bg-surface flex flex-col items-center justify-center p-8 lg:p-24 relative">

        <div class="lg:hidden absolute top-12 left-12 flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <svg class="tacs-login-icon w-6 h-6 text-white" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3.25L5.5 5.8v5.35c0 4.25 2.7 7.95 6.5 9.15 3.8-1.2 6.5-4.9 6.5-9.15V5.8L12 3.25Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                    <path d="M9.25 12.05l1.75 1.75 3.85-4.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2 class="text-xl font-black tracking-tighter text-primary">TACS</h2>
        </div>

        <div class="w-full max-w-md">
            <div class="mb-10">
                <h3 class="text-3xl font-black text-primary tracking-tight mb-2">
                    로그인
                </h3>

                <c:if test="${param.error != null}">
                    <p class="mt-3 text-sm font-bold text-error">
                        아이디 또는 비밀번호가 올바르지 않습니다.
                    </p>
                </c:if>

                <c:if test="${param.logout != null}">
                    <p class="mt-3 text-sm font-bold text-secondary">
                        정상적으로 로그아웃되었습니다.
                    </p>
                </c:if>
            </div>
            
            <form class="space-y-5" action="${pageContext.request.contextPath}/login" method="post">
                <sec:csrfInput/>

                <div class="space-y-1.5">
                    <label class="text-[11px] font-black text-primary uppercase tracking-widest pl-1">
                        사용자 아이디
                    </label>

                    <div class="relative group">
                        <svg class="tacs-login-icon absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary transition-colors group-focus-within:text-primary" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12.15a4.15 4.15 0 1 0 0-8.3 4.15 4.15 0 0 0 0 8.3Z" stroke="currentColor" stroke-width="1.8"/>
                            <path d="M4.9 20.15c.7-3.35 3.45-5.35 7.1-5.35s6.4 2 7.1 5.35" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                        </svg>

                        <input
                                id="usernameInput"
                                name="username"
                                class="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 focus:ring-0 focus:bg-surface-container-highest transition-all text-sm placeholder:text-slate-400 selection:bg-blue-600 selection:text-white"
                                placeholder="아이디를 입력하세요"
                                type="text"
                                autocomplete="username" />
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label class="text-[11px] font-black text-primary uppercase tracking-widest pl-1">
                        비밀번호
                    </label>

                    <div class="relative group">
                        <svg class="tacs-login-icon absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary transition-colors group-focus-within:text-primary" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
                            <path d="M7.75 10.4V8.1a4.25 4.25 0 0 1 8.5 0v2.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                            <path d="M6.4 10.4h11.2c.8 0 1.4.6 1.4 1.4v6.55c0 .8-.6 1.4-1.4 1.4H6.4c-.8 0-1.4-.6-1.4-1.4V11.8c0-.8.6-1.4 1.4-1.4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                            <path d="M12 14.15v2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                        </svg>

                        <input
                                id="passwordInput"
                                name="password"
                                class="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-12 focus:ring-0 focus:bg-surface-container-highest transition-all text-sm placeholder:text-slate-400 selection:bg-blue-600 selection:text-white"
                                placeholder="비밀번호를 입력하세요"
                                type="password"
                                autocomplete="current-password" />

                        <button
                                id="passwordToggle"
                                aria-label="비밀번호 표시"
                                class="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                                type="button">
                            <svg id="passwordToggleIconShow" class="tacs-login-icon w-5 h-5" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
                                <path d="M3.5 12s3.1-5.25 8.5-5.25S20.5 12 20.5 12 17.4 17.25 12 17.25 3.5 12 3.5 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                                <path d="M12 14.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z" stroke="currentColor" stroke-width="1.8"/>
                            </svg>
                            <svg id="passwordToggleIconHide" class="tacs-login-icon w-5 h-5 is-hidden" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
                                <path d="M4.5 4.5l15 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                                <path d="M9.55 6.95A8.4 8.4 0 0 1 12 6.6c5.4 0 8.5 5.4 8.5 5.4a15.2 15.2 0 0 1-2.35 2.85" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14.1 14.55A2.6 2.6 0 0 1 9.45 9.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                                <path d="M6.25 8.15A15.1 15.1 0 0 0 3.5 12s3.1 5.4 8.5 5.4a8.65 8.65 0 0 0 3.2-.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2">
                    <label class="flex items-center space-x-2 cursor-pointer group">
                        <input
                                id="rememberIdInput"
                                name="rememberId"
                                class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-0"
                                type="checkbox" />

                        <span class="text-xs font-medium text-secondary group-hover:text-primary transition-colors">
                                아이디 저장
                            </span>
                    </label>

                    <div class="flex items-center gap-3">
                        <a class="text-xs font-bold text-on-primary-container hover:underline" href="${pageContext.request.contextPath}/join.do">
                            화주회원가입
                        </a>│

                        <a class="text-xs font-bold text-on-primary-container hover:underline" href="${pageContext.request.contextPath}/find-password.do">
                            비밀번호를 잊으셨나요?
                        </a>
                    </div>
                </div>

                <button
                        class="w-full mt-6 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-black tracking-tight text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/10 flex items-center justify-center space-x-2"
                        type="submit">
                    <svg class="tacs-login-icon w-5 h-5" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3.25L5.5 5.8v5.35c0 4.25 2.7 7.95 6.5 9.15 3.8-1.2 6.5-4.9 6.5-9.15V5.8L12 3.25Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                        <path d="M9.25 12.05l1.75 1.75 3.85-4.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>로그인</span>
                </button>
                <div class="mt-6 rounded-xl border border-outline-variant bg-surface-container-low p-4">
                    <div class="flex items-center justify-between gap-3 mb-3">
                        <p class="text-xs font-black text-primary tracking-widest uppercase">발표 시연 계정</p>
                        <span class="text-[10px] font-bold text-secondary">PW 1234</span>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button class="demo-login-button rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-surface-container-high active:scale-[0.98] transition-all" type="button" data-login-id="owner1234">화주</button>
                        <button class="demo-login-button rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-surface-container-high active:scale-[0.98] transition-all" type="button" data-login-id="tf00000001">운송담당자</button>
                        <button class="demo-login-button rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-surface-container-high active:scale-[0.98] transition-all" type="button" data-login-id="wh00000003">창고담당자</button>
                        <button class="demo-login-button rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-surface-container-high active:scale-[0.98] transition-all" type="button" data-login-id="bk00000002">관세사</button>
                        <button class="demo-login-button rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-surface-container-high active:scale-[0.98] transition-all" type="button" data-login-id="CUS2026000003">행정공무원</button>
                        <button class="demo-login-button rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-surface-container-high active:scale-[0.98] transition-all" type="button" data-login-id="QRT2026000003">검역공무원</button>
                        <button class="demo-login-button col-span-2 sm:col-span-3 rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-surface-container-high active:scale-[0.98] transition-all" type="button" data-login-id="admin">시스템관리자</button>
                    </div>
                </div>
            </form>

            <div class="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <a class="text-[11px] font-bold text-secondary hover:text-primary transition-colors" href="#">개인정보처리방침</a>
                <a class="text-[11px] font-bold text-secondary hover:text-primary transition-colors" href="#">이용약관</a>
                <a class="text-[11px] font-bold text-secondary hover:text-primary transition-colors" href="#">공인인증센터</a>
                <a class="text-[11px] font-bold text-secondary hover:text-primary transition-colors" href="#">헬프데스크</a>
            </div>

            <p class="mt-8 text-center text-[10px] text-slate-400 font-medium tracking-tighter">
                © 2026 TACS Sentinel Intelligence. ALL RIGHTS RESERVED.
            </p>
        </div>
    </section>
</main>
<script>
    (() => {
        const usernameInput = document.getElementById('usernameInput');
        const rememberIdInput = document.getElementById('rememberIdInput');
        const passwordInput = document.getElementById('passwordInput');
        const toggleButton = document.getElementById('passwordToggle');
        const toggleIconShow = document.getElementById('passwordToggleIconShow');
        const toggleIconHide = document.getElementById('passwordToggleIconHide');
        const loginForm = document.querySelector('form[action$="/login"]');

        const demoLoginButtons = document.querySelectorAll('.demo-login-button');
        const rememberKey = 'tacs.rememberedLoginId';

        if (usernameInput && rememberIdInput) {
            const rememberedId = localStorage.getItem(rememberKey);
            if (rememberedId) {
                usernameInput.value = rememberedId;
                rememberIdInput.checked = true;
                if (passwordInput) passwordInput.focus();
            }

            rememberIdInput.addEventListener('change', () => {
                if (!rememberIdInput.checked) {
                    localStorage.removeItem(rememberKey);
                }
            });

            if (loginForm) {
                loginForm.addEventListener('submit', () => {
                    const loginId = usernameInput.value.trim();
                    if (rememberIdInput.checked && loginId) {
                        localStorage.setItem(rememberKey, loginId);
                    } else {
                        localStorage.removeItem(rememberKey);
                    }
                });
            }
        }

        if (demoLoginButtons.length && usernameInput && passwordInput && loginForm) {
            demoLoginButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    usernameInput.value = button.dataset.loginId || '';
                    passwordInput.value = '1234';
                    if (typeof loginForm.requestSubmit === 'function') {
                        loginForm.requestSubmit();
                    } else {
                        loginForm.submit();
                    }
                });
            });
        }

        if (!passwordInput || !toggleButton || !toggleIconShow || !toggleIconHide) return;

        toggleButton.addEventListener('click', () => {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            toggleIconShow.classList.toggle('is-hidden', isHidden);
            toggleIconHide.classList.toggle('is-hidden', !isHidden);
            toggleButton.setAttribute('aria-label', isHidden ? '비밀번호 숨기기' : '비밀번호 표시');
        });
    })();
</script>
</body>
</html>
