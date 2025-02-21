<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/index.js';

  let { selected_item, items, item_view, label } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}
    >{@render label()}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Group>
      <DropdownMenu.RadioGroup bind:value={selected_item}>
        {#each items as item}
          <DropdownMenu.RadioItem value={item}>
            {@render item_view(item)}
          </DropdownMenu.RadioItem>
        {/each}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
