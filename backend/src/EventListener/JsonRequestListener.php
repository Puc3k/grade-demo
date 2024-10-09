<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\UnsupportedMediaTypeHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

final class JsonRequestListener
{
    #[AsEventListener(event: KernelEvents::REQUEST)]
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        if (str_starts_with($request->getPathInfo(), '/api')) {
            if (!$request->isMethodSafe() && $request->headers->get('Content-Type') !== 'application/json') {
                throw new UnsupportedMediaTypeHttpException('Content-Type must be application/json');
            }
            if (!$request->headers->get('Accept') || $request->headers->get('Accept') !== 'application/json') {
                throw new UnsupportedMediaTypeHttpException('Accept must be application/json');
            }
        }
    }
}
