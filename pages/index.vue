<template>
  <div
    v-if="showUploadModal || showRecordModal || isLoading"
    class="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
  >
    <div
      v-if="isLoading"
      class="z-30 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-primary"
    ></div>
  </div>
  <div class="relative flex min-h-screen flex-col">
    <div class="flex flex-shrink justify-center">
      <h1 class="mt-6 text-3xl font-medium text-primary">HOME</h1>
    </div>
    <div class="flex flex-grow justify-center">
      <div class="flex items-center">
        <button
          class="mx-11 flex flex-row items-center"
          @click="showUploadModal = true"
        >
          <img
            class="w-20"
            src="../assets/images/upload.svg"
          />
          <p class="text-3xl font-medium text-primary">Upload</p>
        </button>
        <div class="h-20 w-[1px] bg-grey-light"></div>
        <button
          class="mx-11 flex flex-row items-center"
          @click="showRecordModal = true"
        >
          <img
            class="w-20"
            src="../assets/images/voice.svg"
          />
          <p class="text-3xl font-medium text-primary">Record</p>
        </button>
      </div>
    </div>

    <!-- ファイルアップロードモーダル -->
    <div
      v-if="showUploadModal"
      class="fixed left-1/2 top-1/2 z-20 translate-x-[-50%] translate-y-[-80%] rounded-lg bg-grey-medium px-3 py-2 shadow-lg"
    >
      <button
        class="absolute right-[-2rem] top-[-2rem] w-8 cursor-pointer rounded-full shadow-lg hover:bg-red-600/40"
        @click="showUploadModal = false"
      >
        <img
          class="p-1"
          src="../assets/images/close_white.svg"
        />
      </button>
      <form
        @submit.prevent="handleSubmit"
        enctype="multipart/form-data"
        class="relative flex items-center space-x-3"
      >
        <div class="px-3 py-2">
          <input
            class="border-e-red-300 text-orange-white file:mr-4 file:rounded-md file:border-0 file:bg-grey-light file:px-4 file:py-2 file:text-sm file:text-orange-white"
            type="file"
            name="input_data"
            @change="handleFileChange"
          />
        </div>
        <button
          type="submit"
          class="rounded-full bg-primary px-2 py-2"
        >
          <img
            class="w-6"
            src="../assets/images/arrow_right.svg"
            alt=""
          />
        </button>
      </form>
    </div>

    <!-- 音声録音モーダル -->
    <div
      v-if="showRecordModal"
      class="fixed left-1/2 top-1/2 z-20 flex translate-x-[-50%] translate-y-[-80%] rounded-lg bg-grey-medium px-5 py-3 shadow-lg"
    >
      <button
        class="absolute right-[-2rem] top-[-2rem] w-8 cursor-pointer rounded-full shadow-lg hover:bg-red-600/40"
        @click="showRecordModal = false"
      >
        <img
          class="p-1"
          src="../assets/images/close_white.svg"
        />
      </button>
      <div
        v-if="doneRecording === false"
        class="flex items-center justify-between space-x-6"
      >
        <div
          class=""
          @click="switchIsRecording()"
        >
          <button
            class="w-38 flex items-center space-x-2 rounded-full border-2 border-orange-white px-2 py-1 text-2xl text-orange-white hover:bg-grey-light"
            v-if="isRecording === false"
            @click="startRecording"
          >
            <img
              class="w-9"
              src="../assets/images/start_recording.svg"
              alt=""
            />
            <p class="pb-1 pr-2 font-medium">Record</p>
          </button>
          <button
            class="w-38 flex items-center space-x-2 rounded-full border-2 border-[#ff0000] px-2 py-1 text-2xl hover:bg-[#6f20203c]"
            v-else
            @click="stopRecording"
          >
            <img
              class="w-9"
              src="../assets/images/pause_recording_red.svg"
              alt=""
            />
            <p class="pb-1 pr-2 font-medium text-[#FF0000]">Pause</p>
          </button>
        </div>
        <button
          v-if="isRecorded === true"
          @click="finishRecording"
          type="submit"
          class="rounded-full bg-primary px-2 py-2"
        >
          <img
            class="w-6"
            src="../assets/images/arrow_right.svg"
            alt=""
          />
        </button>
      </div>
      <div v-else>
        <form
          @submit.prevent="handleSubmit"
          enctype="multipart/form-data"
          class="flex items-center justify-between space-x-5 p-1"
        >
          <audio
            v-if="audioUrl"
            :src="audioUrl"
            controls
          ></audio>
          <button
            @click="finishRecording"
            type="submit"
            class="rounded-full bg-primary px-2 py-2"
          >
            <img
              class="w-9"
              src="../assets/images/arrow_right.svg"
              alt=""
            />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { AudioRecorder } from "./audioRecorder";

  const config = useRuntimeConfig();
  const selectedFile = ref<File | null>(null);
  const apiEndpoint = config.public.API_ENDPOINT_BASE_URL;
  const router = useRouter();
  const feedback = useState("feedback", () => shallowRef());
  const transcription = useState("transcription", () => shallowRef());
  const showUploadModal = ref(false);
  const showRecordModal = ref(false);
  const isRecording = ref(false);
  const doneRecording = ref(false);
  const recordedAudioFile = ref<File | null>(null);
  const isRecorded = ref(false);
  const isLoading = ref(false);

  const audioUrl = ref<string | null>("");
  const audioDuration = ref(0);
  const recorder = new AudioRecorder();

  const switchIsRecording = () => {
    isRecording.value = !isRecording.value;
  };

  const handleFileChange = (event: Event) => {
    try {
      const input = event.target as HTMLInputElement;
      selectedFile.value = input.files?.[0] ?? null; // ファイルが選択されていない場合はnullをセット しないと型エラーになる
    } catch (error) {
      console.log("【ファイル更新処理失敗】：" + error);
      alert("エラーが発生しました");
    }
  };

  const startRecording = async () => {
    await recorder.startRecording();
  };

  const stopRecording = async () => {
    try {
      await recorder.stopRecording();
      if (isRecorded.value === false) {
        audioUrl.value = await recorder.getAudioUrl();
        isRecorded.value = true;
      }
    } catch (error) {
      console.log("【録音停止処理失敗】：" + error);
      alert("エラーが発生しました");
    }
  };

  const finishRecording = async () => {
    try {
      audioDuration.value = await recorder.getDuration();
      audioUrl.value = await recorder.getAudioUrl();
      const audioBlob = await recorder.getBlob();
      recordedAudioFile.value = new File([audioBlob!], "recorded_audio.wav", {
        type: "audio/wav",
      });

      doneRecording.value = true;
    } catch (error) {
      console.log("【録音終了処理失敗】：" + error);
      alert("エラーが発生しました");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile.value && !recordedAudioFile.value) {
      alert("ファイルを選択するか、音声を録音してください");
      return;
    }
    isLoading.value = true;
    showUploadModal.value = false;
    showRecordModal.value = false;

    try {
      const formData = new FormData();
      if (selectedFile.value) {
        formData.append("input_data", selectedFile.value);
      } else if (recordedAudioFile.value) {
        formData.append("input_data", recordedAudioFile.value);
      }

      const response = await fetch(apiEndpoint + "/transcript", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "success") {
        feedback.value = await data.value.feedback;
        transcription.value = await data.value.transcription;
        router.push("/feedback");
      } else if (data.status === "invalid") {
        alert(data.value); // データが存在しません
      }
    } catch (error) {
      console.log("【ファイル送信処理失敗】：" + error);
      alert("エラーが発生しました");
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style>
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
