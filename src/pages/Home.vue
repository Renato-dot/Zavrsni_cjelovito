<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-xl">
      <h1 class="text-h2 text-primary q-mb-md">
        <q-icon name="sports_soccer" size="xl" class="q-mr-md" />
        SportFields Rental
      </h1>
      <p class="text-h6 text-grey-7">Find and rent the perfect sport field for your game</p>
    </div>

    <div class="row q-gutter-md justify-center">
      <q-card class="col-md-3 col-sm-5 col-12 sport-card" @click="$router.push('/field-listings')">
        <q-card-section class="text-center">
          <q-icon name="sports_soccer" size="4rem" color="primary" />
          <div class="text-h6 q-mt-md">Browse Fields</div>
          <div class="text-caption text-grey-6">Discover available sport fields</div>
        </q-card-section>
      </q-card>

      <q-card class="col-md-3 col-sm-5 col-12 sport-card" @click="$router.push('/external-links')">
        <q-card-section class="text-center">
          <q-icon name="link" size="4rem" color="secondary" />
          <div class="text-h6 q-mt-md">External Resources</div>
          <div class="text-caption text-grey-6">Visit partner sport facilities</div>
        </q-card-section>
      </q-card>

      <q-card class="col-md-3 col-sm-5 col-12 sport-card" @click="$router.push('/search')">
        <q-card-section class="text-center">
          <q-icon name="search" size="4rem" color="accent" />
          <div class="text-h6 q-mt-md">Search</div>
          <div class="text-caption text-grey-6">Find exactly what you need</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mt-xl text-center">
      <q-btn
        color="primary"
        size="lg"
        label="Get Started"
        icon="play_arrow"
        @click="$router.push('/field-listings')"
      />
    </div>
  </q-page>
</template>

<style scoped>
.sport-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.sport-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
</style>