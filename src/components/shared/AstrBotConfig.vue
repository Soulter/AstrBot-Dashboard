<template>
    <h3 style="margin-bottom: 8px;" v-if="iterable && metadata[metadataKey]?.type === 'object'">{{ metadata[metadataKey]?.description }}</h3>
    <v-card-text>
        
        <v-row v-for="(index, key) in iterable" :key="key" style="margin-bottom: 0.5px;">
            <v-text-field v-if="metadata[metadataKey].items[key]?.type === 'string' && key !== 'name'"
                v-model="iterable[key]" :label="metadata[metadataKey].items[key]?.description + '(' + key + ')'"
                variant="outlined" dense></v-text-field>
            <v-text-field v-if="(metadata[metadataKey].items[key]?.type === 'int' || metadata[metadataKey].items[key]?.type === 'float') && key !== 'name'"
                v-model="iterable[key]" :label="metadata[metadataKey].items[key]?.description + '(' + key + ')'"
                variant="outlined" dense></v-text-field>
            <v-switch v-else-if="metadata[metadataKey].items[key]?.type === 'bool'" v-model="iterable[key]"
                :label="metadata[metadataKey].items[key]?.description + '(' + key + ')'" color="primary"
                inset></v-switch>
            <v-combobox variant="outlined" v-else-if="metadata[metadataKey].items[key]?.type === 'list'"
                v-model="iterable[key]" chips clearable
                :label="metadata[metadataKey].items[key]?.description + '(' + key + ')'" multiple
                prepend-icon="mdi-tag-multiple-outline">
                <template v-slot:selection="{ attrs, item, select, selected }">
                    <v-chip v-bind="attrs" :model-value="selected" closable @click="select" @click:close="remove(item)">
                        <strong>{{ item }}</strong>
                    </v-chip>
                </template>
            </v-combobox>
        </v-row>
    </v-card-text>
</template>

<script>
export default {
    props: {
        metadata: Object,
        iterable: Object,
        metadataKey: String
    }
}
</script>