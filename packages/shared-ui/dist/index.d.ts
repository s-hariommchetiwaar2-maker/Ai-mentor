import React from 'react';

declare function cn(...classes: (string | undefined | null | false)[]): string;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}
declare const Button: React.FC<ButtonProps>;
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
}
declare const Card: React.FC<CardProps>;
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}
declare const Input: React.FC<InputProps>;
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'gray' | 'white';
}
declare const Spinner: React.FC<SpinnerProps>;
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}
declare const Modal: React.FC<ModalProps>;
interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose?: () => void;
}
declare const Toast: React.FC<ToastProps>;
interface NavigationLink {
    label: string;
    href: string;
}
interface NavigationProps {
    brandName: string;
    links: NavigationLink[];
}
declare const Navigation: React.FC<NavigationProps>;
interface BaseLayoutProps {
    brandName: string;
    links: NavigationLink[];
    children: React.ReactNode;
}
declare const BaseLayout: React.FC<BaseLayoutProps>;
declare const LoadingPage: React.FC;
interface ErrorPageProps {
    title?: string;
    message?: string;
    onReset?: () => void;
}
declare const ErrorPage: React.FC<ErrorPageProps>;

export { BaseLayout, type BaseLayoutProps, Button, type ButtonProps, Card, type CardProps, ErrorPage, type ErrorPageProps, Input, type InputProps, LoadingPage, Modal, type ModalProps, Navigation, type NavigationLink, type NavigationProps, Spinner, type SpinnerProps, Toast, type ToastProps, cn };
