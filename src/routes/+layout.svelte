<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex h-svh flex-col bg-background">
	<header class="z-40 h-fit w-full bg-secondary shadow-lg shadow-background lg:fixed">
		<nav class="flex w-full flex-row items-center space-x-3 border-0 bg-accent p-4 md:border-b-2">
			<div class="flex h-fit flex-row items-center justify-center">
				<!-- <img src="/icons/capsized-logo-notext.svg" alt="Logo of capsized" class="h-10" /> -->
				<h1 class="ml-2 font-mono text-xl font-bold italic text-primary">statVized</h1>
			</div>
		</nav>
	</header>
	{@render children()}
</div>
